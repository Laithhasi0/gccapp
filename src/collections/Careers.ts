import type { CollectionConfig } from "payload";
import { orderField, slugField } from "@/lib/adminFields";

/** Open roles shown on the Careers page. */
export const Careers: CollectionConfig = {
  slug: "careers",
  labels: { singular: "Role", plural: "Careers" },
  admin: {
    useAsTitle: "role",
    group: "Content",
    defaultColumns: ["role", "location", "type", "order"],
    listSearchableFields: ["role", "description"],
    description: "Open positions listed on /careers.",
  },
  access: { read: () => true },
  defaultSort: "order",
  fields: [
    { name: "role", type: "text", required: true, localized: true },
    {
      type: "row",
      fields: [
        { name: "location", type: "text", required: true, localized: true, admin: { description: "e.g. Riyadh / Remote" } },
        { name: "type", type: "text", required: true, localized: true, admin: { description: "e.g. Full-time" } },
      ],
    },
    { name: "description", type: "textarea", required: true, localized: true },
    slugField("role"),
    orderField(),
  ],
};
