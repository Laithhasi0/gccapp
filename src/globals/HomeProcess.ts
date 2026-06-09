import type { GlobalConfig } from "payload";

/** "How we work" process section. */
export const HomeProcess: GlobalConfig = {
  slug: "home-process",
  label: "Home — Process",
  admin: { group: "Content" },
  access: { read: () => true },
  fields: [
    { name: "eyebrow", type: "text", localized: true, defaultValue: "How we work" },
    { name: "heading", type: "text", localized: true, defaultValue: "A clear, proven process" },
    { name: "description", type: "textarea", localized: true },
    {
      name: "steps",
      type: "array",
      labels: { singular: "Step", plural: "Steps" },
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        { name: "description", type: "textarea", required: true, localized: true },
      ],
    },
  ],
};
