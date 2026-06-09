import type { GlobalConfig } from "payload";

/** "What we do" pinned scrollytelling section. */
export const HomeCapabilities: GlobalConfig = {
  slug: "home-capabilities",
  label: "Home — What we do",
  admin: { group: "Content" },
  access: { read: () => true },
  fields: [
    { name: "eyebrow", type: "text", localized: true, defaultValue: "What we do" },
    {
      name: "items",
      type: "array",
      labels: { singular: "Capability", plural: "Capabilities" },
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        {
          type: "row",
          fields: [
            { name: "eyebrow", type: "text", required: true, localized: true },
            { name: "title", type: "text", required: true, localized: true },
          ],
        },
        { name: "text", type: "textarea", required: true, localized: true },
        { name: "href", type: "text", admin: { description: "Link, e.g. /services/branding" } },
      ],
    },
  ],
};
