import type { CollectionConfig } from "payload";

/** FAQ entries, grouped by category on the front end. */
export const Faqs: CollectionConfig = {
  slug: "faqs",
  labels: { singular: "FAQ", plural: "FAQs" },
  admin: {
    useAsTitle: "question",
    group: "Content",
    defaultColumns: ["question", "category", "order"],
    listSearchableFields: ["question", "answer"],
  },
  access: { read: () => true },
  defaultSort: "order",
  fields: [
    { name: "question", type: "text", required: true, localized: true },
    { name: "answer", type: "textarea", required: true, localized: true },
    {
      name: "category",
      type: "text",
      required: true,
      localized: true,
      admin: { description: "Groups FAQs on the page, e.g. Pricing, Process." },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Lower numbers appear first." },
    },
  ],
};
