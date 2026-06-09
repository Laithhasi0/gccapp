import type { CollectionConfig } from "payload";

/** Open roles shown on the Careers page. */
export const Careers: CollectionConfig = {
  slug: "careers",
  labels: { singular: "Role", plural: "Careers" },
  admin: {
    useAsTitle: "role",
    group: "Content",
    defaultColumns: ["role", "location", "type", "order"],
  },
  access: { read: () => true },
  defaultSort: "order",
  fields: [
    {
      type: "row",
      fields: [
        { name: "role", type: "text", required: true, localized: true },
        { name: "slug", type: "text", required: true, unique: true },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "location", type: "text", required: true },
        { name: "type", type: "text", required: true, admin: { description: "e.g. Full-time" } },
      ],
    },
    { name: "description", type: "textarea", required: true, localized: true },
    { name: "order", type: "number", defaultValue: 0 },
  ],
};
