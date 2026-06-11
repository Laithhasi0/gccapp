import type { GlobalConfig } from "payload";

/** Home page hero — headline, copy, CTAs, background media, stats. */
export const HomeHero: GlobalConfig = {
  slug: "home-hero",
  label: "Home — Hero",
  admin: { group: "Content" },
  access: { read: () => true },
  fields: [
    { name: "badge", type: "text", localized: true, admin: { description: "Small pill above the headline." } },
    {
      type: "row",
      fields: [
        { name: "headline", type: "text", required: true, localized: true },
        {
          name: "highlight",
          type: "text",
          localized: true,
          admin: { description: "Part of the headline shown in the cyan gradient." },
        },
      ],
    },
    { name: "subheading", type: "textarea", localized: true },
    {
      name: "primaryCta",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", type: "text", localized: true, defaultValue: "Get Started" },
            { name: "href", type: "text", defaultValue: "/contact" },
          ],
        },
      ],
    },
    {
      name: "secondaryCta",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", type: "text", localized: true, defaultValue: "View Portfolio" },
            { name: "href", type: "text", defaultValue: "/portfolio" },
          ],
        },
      ],
    },
    {
      name: "posterImage",
      type: "upload",
      relationTo: "media",
      admin: { description: "Background image / video poster." },
    },
    {
      name: "backgroundVideoUrl",
      type: "text",
      admin: { description: "Optional background video path, e.g. /media/video/hero-background-loop.mp4" },
    },
    { name: "showStats", type: "checkbox", defaultValue: true, label: "Show the stats strip" },
    {
      name: "stats",
      type: "array",
      maxRows: 4,
      labels: { singular: "Stat", plural: "Stats" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "value", type: "text", required: true, admin: { description: 'e.g. "150+"' } },
            { name: "label", type: "text", required: true, localized: true },
          ],
        },
      ],
    },
  ],
};
