import type { CollectionConfig } from "payload";

/** "Our People" — fully editable team members. Sorted by `order` in admin. */
export const Team: CollectionConfig = {
  slug: "team",
  labels: { singular: "Team member", plural: "Team" },
  admin: {
    useAsTitle: "name",
    group: "Content",
    defaultColumns: ["name", "role", "department", "featured", "order"],
    listSearchableFields: ["name", "role", "workingOn"],
  },
  access: { read: () => true },
  defaultSort: "order",
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, localized: true },
        {
          name: "role",
          type: "text",
          required: true,
          localized: true,
          admin: { description: 'Job title, e.g. "Lead iOS Engineer"' },
        },
      ],
    },
    {
      name: "workingOn",
      type: "text",
      localized: true,
      label: "Currently working on",
      admin: { description: 'Short line, e.g. "GCC App e-commerce platform"' },
    },
    {
      name: "bio",
      type: "textarea",
      localized: true,
      admin: { description: "Short paragraph, revealed on hover." },
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: { description: "Square photo works best (auto-cropped)." },
    },
    {
      name: "department",
      type: "select",
      options: ["Engineering", "Design", "Marketing", "Management"],
      admin: { description: "Used for the front-end filter chips." },
    },
    {
      name: "socials",
      type: "group",
      label: "Social links",
      fields: [
        {
          type: "row",
          fields: [
            { name: "linkedin", type: "text" },
            { name: "x", type: "text", label: "X (Twitter)" },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "github", type: "text" },
            { name: "email", type: "email" },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "order",
          type: "number",
          defaultValue: 0,
          admin: { description: "Lower numbers appear first." },
        },
        {
          name: "featured",
          type: "checkbox",
          defaultValue: false,
          label: "Feature on home page",
        },
      ],
    },
  ],
};
