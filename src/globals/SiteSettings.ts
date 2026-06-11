import type { GlobalConfig } from "payload";

/** Global site settings — header, contact, socials, footer. */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: { group: "Site" },
  access: { read: () => true },
  fields: [
    {
      type: "row",
      fields: [
        { name: "siteName", type: "text", required: true, defaultValue: "GCC App" },
        {
          name: "availabilityText",
          type: "text",
          localized: true,
          defaultValue: "Available for projects",
          admin: { description: "Small status shown in the header." },
        },
      ],
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: { description: "Optional logo image (falls back to the GCC App wordmark)." },
    },
    {
      name: "contact",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            { name: "email", type: "email", required: true },
            { name: "phone", type: "text", required: true },
          ],
        },
        {
          name: "phoneHref",
          type: "text",
          admin: { description: 'Tel link, e.g. tel:+19387407555' },
        },
        { name: "address", type: "text" },
      ],
    },
    {
      name: "footerBlurb",
      type: "textarea",
      localized: true,
      admin: { description: "Short paragraph shown in the footer." },
    },
    {
      name: "headerCta",
      type: "group",
      label: "Header button",
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", type: "text", localized: true, defaultValue: "Contact Us" },
            { name: "href", type: "text", defaultValue: "/contact" },
          ],
        },
      ],
    },
    {
      name: "socials",
      type: "array",
      labels: { singular: "Social link", plural: "Social links" },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "platform",
              type: "select",
              required: true,
              options: ["linkedin", "instagram", "twitter", "facebook", "dribbble", "youtube", "github"],
            },
            { name: "url", type: "text", required: true },
          ],
        },
      ],
    },
  ],
};
