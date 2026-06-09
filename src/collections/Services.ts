import type { CollectionConfig } from "payload";

/** Services — fully editable: title, image, body, features, icon. */
export const Services: CollectionConfig = {
  slug: "services",
  labels: { singular: "Service", plural: "Services" },
  admin: {
    useAsTitle: "title",
    group: "Content",
    defaultColumns: ["title", "slug", "order"],
  },
  access: { read: () => true },
  defaultSort: "order",
  fields: [
    {
      type: "row",
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          admin: { description: "URL path, e.g. mobile-app" },
        },
      ],
    },
    {
      name: "icon",
      type: "select",
      required: true,
      defaultValue: "globe",
      options: [
        { label: "Smartphone", value: "smartphone" },
        { label: "Globe", value: "globe" },
        { label: "Shopping cart", value: "shopping-cart" },
        { label: "Palette", value: "palette" },
        { label: "Megaphone", value: "megaphone" },
        { label: "Search", value: "search" },
        { label: "Server", value: "server" },
        { label: "Users", value: "users" },
        { label: "Shopping bag", value: "shopping-bag" },
        { label: "Pen tool", value: "pen-tool" },
      ],
    },
    { name: "excerpt", type: "textarea", required: true, localized: true },
    { name: "image", type: "upload", relationTo: "media", required: true },
    {
      name: "body",
      type: "array",
      label: "Body paragraphs",
      labels: { singular: "Paragraph", plural: "Paragraphs" },
      fields: [{ name: "text", type: "textarea", required: true, localized: true }],
    },
    {
      name: "features",
      type: "array",
      label: "What's included",
      fields: [{ name: "text", type: "text", required: true, localized: true }],
    },
    { name: "seoDescription", type: "textarea", localized: true },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { description: "Lower numbers appear first." },
    },
  ],
};
