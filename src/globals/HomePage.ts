import type { Block, Field, GlobalConfig } from "payload";

/**
 * Home page builder — the single source of truth for the home page.
 *
 * The page is an ordered list of section "blocks". The Visual Editor
 * (/editor) reads and writes this global through /api/editor/home: it can
 * reorder, add, hide, duplicate and remove sections, and edits text inline.
 *
 * Field names inside each block intentionally match the prop/edit paths used
 * by the front-end section components (eyebrow / title / description ...) so
 * the editor can address any text node as e.g. `sections.2.steps.1.title`.
 *
 * While this global is empty the site keeps rendering from the legacy
 * home-* globals / seed content; the first save from the Visual Editor
 * migrates everything here (see src/lib/homePage.ts).
 */

const hidden: Field = {
  name: "hidden",
  type: "checkbox",
  defaultValue: false,
  admin: { description: "Hide this section without deleting it." },
};

const heading: Field[] = [
  { name: "eyebrow", type: "text", localized: true },
  { name: "title", type: "text", localized: true },
  { name: "description", type: "textarea", localized: true },
];

const linkRow = (name: string, label: string): Field => ({
  name,
  type: "group",
  label,
  fields: [
    {
      type: "row",
      fields: [
        { name: "label", type: "text", localized: true },
        { name: "href", type: "text" },
      ],
    },
  ],
});

const statsArray: Field = {
  name: "stats",
  type: "array",
  labels: { singular: "Stat", plural: "Stats" },
  fields: [
    {
      type: "row",
      fields: [
        { name: "value", type: "text", admin: { description: 'e.g. "150+"' } },
        { name: "label", type: "text", localized: true },
      ],
    },
  ],
};

const HeroBlock: Block = {
  slug: "hero",
  labels: { singular: "Hero", plural: "Hero" },
  fields: [
    hidden,
    { name: "badge", type: "text", localized: true },
    {
      type: "row",
      fields: [
        { name: "headline", type: "text", localized: true },
        { name: "highlight", type: "text", localized: true },
      ],
    },
    { name: "subheading", type: "textarea", localized: true },
    linkRow("primaryCta", "Primary button"),
    linkRow("secondaryCta", "Secondary button"),
    { name: "posterImage", type: "upload", relationTo: "media" },
    { name: "posterImageUrl", type: "text", admin: { description: "Fallback image path/URL when no upload is set." } },
    { name: "backgroundVideoUrl", type: "text" },
    { name: "showStats", type: "checkbox", defaultValue: true },
    statsArray,
  ],
};

const LogosBlock: Block = {
  slug: "logos",
  labels: { singular: "Client logos", plural: "Client logos" },
  fields: [
    hidden,
    { name: "eyebrow", type: "text", localized: true },
    {
      name: "items",
      type: "array",
      labels: { singular: "Logo", plural: "Logos" },
      fields: [
        { name: "image", type: "upload", relationTo: "media" },
        { name: "imageUrl", type: "text", admin: { description: "Fallback image path/URL when no upload is set." } },
        {
          type: "row",
          fields: [
            { name: "name", type: "text" },
            { name: "href", type: "text" },
          ],
        },
      ],
    },
  ],
};

const CapabilitiesBlock: Block = {
  slug: "capabilities",
  labels: { singular: "What we do", plural: "What we do" },
  fields: [
    hidden,
    { name: "eyebrow", type: "text", localized: true },
    {
      name: "items",
      type: "array",
      labels: { singular: "Capability", plural: "Capabilities" },
      fields: [
        { name: "image", type: "upload", relationTo: "media" },
        { name: "imageUrl", type: "text", admin: { description: "Fallback image path/URL when no upload is set." } },
        {
          type: "row",
          fields: [
            { name: "eyebrow", type: "text", localized: true },
            { name: "title", type: "text", localized: true },
          ],
        },
        { name: "text", type: "textarea", localized: true },
        { name: "href", type: "text" },
      ],
    },
  ],
};

const ProcessBlock: Block = {
  slug: "process",
  labels: { singular: "Process", plural: "Process" },
  fields: [
    hidden,
    ...heading,
    {
      name: "steps",
      type: "array",
      labels: { singular: "Step", plural: "Steps" },
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "description", type: "textarea", localized: true },
      ],
    },
  ],
};

const headingOnlyBlock = (slug: string, label: string): Block => ({
  slug,
  labels: { singular: label, plural: label },
  fields: [hidden, ...heading],
});

const StatsBlock: Block = {
  slug: "statsStrip",
  labels: { singular: "Stats strip", plural: "Stats strips" },
  fields: [hidden, statsArray],
};

const CTABlock: Block = {
  slug: "cta",
  labels: { singular: "Call to action", plural: "Calls to action" },
  fields: [
    hidden,
    { name: "title", type: "text", localized: true },
    { name: "description", type: "textarea", localized: true },
    {
      type: "row",
      fields: [
        { name: "buttonLabel", type: "text", localized: true },
        { name: "buttonHref", type: "text" },
      ],
    },
  ],
};

const TextBlock: Block = {
  slug: "textBlock",
  labels: { singular: "Custom text", plural: "Custom text" },
  fields: [
    hidden,
    ...heading,
    {
      name: "align",
      type: "select",
      defaultValue: "center",
      options: [
        { label: "Center", value: "center" },
        { label: "Start", value: "left" },
      ],
    },
  ],
};

const ImageTextBlock: Block = {
  slug: "imageText",
  labels: { singular: "Image & text", plural: "Image & text" },
  fields: [
    hidden,
    { name: "image", type: "upload", relationTo: "media" },
    { name: "imageUrl", type: "text", admin: { description: "Fallback image path/URL when no upload is set." } },
    ...heading,
    {
      type: "row",
      fields: [
        { name: "buttonLabel", type: "text", localized: true },
        { name: "buttonHref", type: "text" },
      ],
    },
    {
      name: "imagePosition",
      type: "select",
      defaultValue: "right",
      options: [
        { label: "Image after text", value: "right" },
        { label: "Image before text", value: "left" },
      ],
    },
  ],
};

export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Home page (Visual Editor)",
  admin: {
    group: "Content",
    description: "Edit this with the Visual Editor for the best experience.",
  },
  access: { read: () => true },
  fields: [
    {
      name: "sections",
      type: "blocks",
      blocks: [
        HeroBlock,
        LogosBlock,
        CapabilitiesBlock,
        headingOnlyBlock("services", "Services grid"),
        ProcessBlock,
        headingOnlyBlock("caseStudies", "Case studies"),
        headingOnlyBlock("showcase", "Selected work"),
        headingOnlyBlock("team", "Team"),
        StatsBlock,
        CTABlock,
        headingOnlyBlock("contact", "Contact"),
        TextBlock,
        ImageTextBlock,
      ],
    },
  ],
};
