import type { CollectionConfig } from "payload";

/** Portfolio projects — fully editable: cover image, story, tags, featured. */
export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Project", plural: "Portfolio" },
  admin: {
    useAsTitle: "title",
    group: "Content",
    defaultColumns: ["title", "category", "client", "year", "featured", "order"],
  },
  access: { read: () => true },
  defaultSort: "order",
  fields: [
    {
      type: "row",
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        { name: "slug", type: "text", required: true, unique: true },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "category",
          type: "select",
          required: true,
          options: ["E-Commerce", "Mobile", "Dashboard", "Branding", "Web App"],
        },
        { name: "client", type: "text", required: true },
        { name: "year", type: "number", required: true },
      ],
    },
    { name: "cover", type: "upload", relationTo: "media", required: true },
    { name: "excerpt", type: "textarea", required: true, localized: true },
    { name: "challenge", type: "textarea", localized: true },
    { name: "solution", type: "textarea", localized: true },
    { name: "result", type: "textarea", localized: true },
    {
      name: "tags",
      type: "array",
      fields: [{ name: "tag", type: "text", required: true }],
    },
    {
      type: "row",
      fields: [
        { name: "order", type: "number", defaultValue: 0 },
        { name: "featured", type: "checkbox", defaultValue: false, label: "Feature on home page" },
      ],
    },
  ],
};
