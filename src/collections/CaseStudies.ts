import type { CollectionConfig } from "payload";
import { orderField, slugField } from "@/lib/adminFields";

/** In-depth case studies with metrics and content sections. */
export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  labels: { singular: "Case study", plural: "Case Studies" },
  admin: {
    useAsTitle: "title",
    group: "Content",
    defaultColumns: ["title", "category", "order"],
    listSearchableFields: ["title", "summary"],
    description: "Results stories with numbers. Shown on /case-studies and the home page tabs.",
  },
  access: { read: () => true },
  defaultSort: "order",
  fields: [
    { name: "title", type: "text", required: true, localized: true },
    { name: "category", type: "text", required: true, admin: { description: "e.g. Development, Design, Marketing." } },
    { name: "summary", type: "textarea", required: true, localized: true, admin: { description: "Short line shown on the card." } },
    { name: "cover", type: "upload", relationTo: "media", required: true },
    {
      name: "metrics",
      type: "array",
      maxRows: 4,
      admin: { description: "The big numbers, e.g. +34% conversion." },
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
      admin: { description: "The story on the case study's own page." },
      fields: [
        { name: "heading", type: "text", required: true, localized: true },
        { name: "body", type: "textarea", required: true, localized: true },
      ],
    },
    slugField("title"),
    orderField(),
  ],
};
