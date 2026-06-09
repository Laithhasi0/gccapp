import type { CollectionConfig } from "payload";

/** In-depth case studies with metrics and content sections. */
export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  labels: { singular: "Case study", plural: "Case Studies" },
  admin: {
    useAsTitle: "title",
    group: "Content",
    defaultColumns: ["title", "category", "order"],
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
        { name: "category", type: "text", required: true },
        { name: "order", type: "number", defaultValue: 0 },
      ],
    },
    { name: "summary", type: "textarea", required: true, localized: true },
    { name: "cover", type: "upload", relationTo: "media", required: true },
    {
      name: "metrics",
      type: "array",
      maxRows: 4,
      fields: [
        {
          type: "row",
          fields: [
            { name: "value", type: "text", required: true, admin: { description: 'e.g. "+34%"' } },
            { name: "label", type: "text", required: true, localized: true },
          ],
        },
      ],
    },
    {
      name: "sections",
      type: "array",
      labels: { singular: "Section", plural: "Sections" },
      fields: [
        { name: "heading", type: "text", required: true, localized: true },
        { name: "body", type: "textarea", required: true, localized: true },
      ],
    },
  ],
};
