/** Tiny immutable deep get/set used by the Visual Editor state. */

export function getDeep(node: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>((n, k) => (n == null ? undefined : (n as Record<string, unknown>)[k]), node);
}

/** Returns a structurally-shared copy of `root` with `path` set to `value`. */
export function setDeep<T>(root: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const clone = (node: unknown, i: number): unknown => {
    if (i === keys.length) return value;
    const key = keys[i];
    if (Array.isArray(node)) {
      const copy = node.slice();
      copy[Number(key)] = clone(node[Number(key)], i + 1);
      return copy;
    }
    const obj = (node ?? {}) as Record<string, unknown>;
    return { ...obj, [key]: clone(obj[key], i + 1) };
  };
  return clone(root, 0) as T;
}

export const newRowId = () => `new-${crypto.randomUUID()}`;

/**
 * Copies row ids from `src` into `dst` by position (sections and nested array
 * rows). Used after saving Arabic: the server's response carries the real row
 * ids, which must be grafted onto the English tree before saving it — same
 * ids → Payload updates the same rows, keeping both languages on one row.
 */
export function graftIds<T>(src: unknown, dst: T): T {
  if (Array.isArray(src) && Array.isArray(dst)) {
    return dst.map((d, i) => graftIds(src[i], d)) as unknown as T;
  }
  if (src && dst && typeof src === "object" && typeof dst === "object" && !Array.isArray(dst)) {
    const s = src as Record<string, unknown>;
    const out: Record<string, unknown> = { ...(dst as Record<string, unknown>) };
    if (typeof s.id === "string" || typeof s.id === "number") out.id = s.id;
    for (const k of Object.keys(out)) {
      if (k !== "id" && k in s) out[k] = graftIds(s[k], out[k]);
    }
    return out as T;
  }
  return dst;
}
