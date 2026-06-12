import type { CollectionConfig } from "payload";
import { orderField, slugField } from "@/lib/adminFields";

/** Services — the cards on /services and the home page services grid. */
export const Services: CollectionConfig = {
  slug: "services",
  labels: { singular: "Service", plural: "Services" },
  admin: {
    useAsTitle: "title",
    group: "Content",
    defaultColumns: ["title", "icon", "order"],
    listSearchableFields: ["title", "excerpt"],
    description: "Each service is a card on the website, with its own page. Arabic and English text are edited per language (top-right language switcher).",
  },
  access: { read: () => true },
  defaultSort: "order",
  fields: [
    { name: "title", type: "text", required: true, localized: true },
    { name: "excerpt", type: "textarea", required: true, localized: true, admin: { description: "Short line shown on the card." } },
    { name: "image", type: "upload", relationTo: "media", required: true },
    {
      name: "icon",
      type: "select",
      required: true,
      defaultValue: "globe",
      admin: { description: "Small icon on the card." },
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
    {
      name: "body",
      type: "array",
      label: "Body paragraphs",
      labels: { singular: "Paragraph", plural: "Paragraphs" },
      admin: { description: "The text on the service's own page." },
      fields: [{ name: "text", type: "textarea", required: true, localized: true }],
    },
    {
      name: "features",
      type: "array",
      label: "What's included",
      fields: [{ name: "text", type: "text", required: true, localized: true }],
    },
    {
      type: "collapsible",
      label: "SEO (optional)",
      admin: { initCollapsed: true },
      fields: [
        {
          name: "seoDescription",
          type: "textarea",
          localized: true,
          admin: { description: "Shown in Google results. Falls back to the excerpt." },
        },
      ],
    },
    slugField("title"),
    orderField(),
  ],
};
