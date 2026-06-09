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
    {
      name: "overview",
      type: "textarea",
      localized: true,
      admin: { description: "Long-form description shown at the top of the project page." },
    },
    { name: "challenge", type: "textarea", localized: true },
    { name: "solution", type: "textarea", localized: true },
    { name: "result", type: "textarea", localized: true },
    {
      name: "features",
      type: "array",
      labels: { singular: "Feature", plural: "Key features" },
      fields: [{ name: "feature", type: "text", required: true, localized: true }],
    },
    {
      name: "techStack",
      type: "array",
      labels: { singular: "Technology", plural: "Tech stack" },
      fields: [{ name: "tech", type: "text", required: true }],
    },
    {
      name: "gallery",
      type: "array",
      labels: { singular: "Image", plural: "Gallery (app screens)" },
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
      ],
    },
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
