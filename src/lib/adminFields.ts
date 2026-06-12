import type { Field } from "payload";

/** Shared field helpers that keep the admin simple and consistent. */

const slugify = (v: string): string =>
  v
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * URL slug that fills itself in from another field (e.g. the title), so
 * editors never have to think about it. Lives in the sidebar.
 */
export const slugField = (sourceField = "title"): Field => ({
  name: "slug",
  type: "text",
  unique: true,
  index: true,
  admin: {
    position: "sidebar",
    description: "The page address (URL). Created automatically — only change it if you must.",
  },
  hooks: {
    beforeValidate: [
      ({ value, data, originalDoc }) => {
        const typed = typeof value === "string" ? slugify(value) : "";
        if (typed) return typed;
        const src = (data?.[sourceField] ?? (originalDoc as Record<string, unknown> | undefined)?.[sourceField]) as
          | string
          | undefined;
        const auto = src ? slugify(src) : "";
        return auto || `item-${Math.random().toString(36).slice(2, 8)}`;
      },
    ],
  },
});

/** Manual sort order, tucked into the sidebar. */
export const orderField = (): Field => ({
  name: "order",
  type: "number",
  defaultValue: 0,
  admin: { position: "sidebar", description: "Lower numbers appear first." },
});

/** "Feature on home page" checkbox, tucked into the sidebar. */
export const featuredField = (): Field => ({
  name: "featured",
  type: "checkbox",
  defaultValue: false,
  label: "Feature on home page",
  admin: { position: "sidebar" },
});
