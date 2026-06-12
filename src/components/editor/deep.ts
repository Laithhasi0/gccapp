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
