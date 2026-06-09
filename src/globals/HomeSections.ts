import type { GlobalConfig } from "payload";

/**
 * Home — Sections, stats & CTA.
 * The section titles, the number stats and the call-to-action block that were
 * previously hardcoded, so the client can edit every word on the home page.
 */
export const HomeSections: GlobalConfig = {
  slug: "home-sections",
  label: "Home — Sections, stats & CTA",
  admin: { group: "Content" },
  access: { read: () => true },
  fields: [
    {
      type: "group",
      name: "services",
      label: "Services section heading",
      fields: [
        { name: "eyebrow", type: "text", localized: true, defaultValue: "What we do" },
        { name: "title", type: "text", localized: true, defaultValue: "Services built around outcomes" },
        { name: "description", type: "textarea", localized: true, defaultValue: "From first idea to launch and growth, we cover the full digital product lifecycle." },
      ],
    },
    {
      type: "group",
      name: "selectedWork",
      label: "Selected work heading",
      fields: [
        { name: "eyebrow", type: "text", localized: true, defaultValue: "Selected work" },
        { name: "title", type: "text", localized: true, defaultValue: "Projects we're proud of" },
      ],
    },
    {
      type: "group",
      name: "caseStudies",
      label: "Case studies heading",
      fields: [
        { name: "eyebrow", type: "text", localized: true, defaultValue: "Case studies" },
        { name: "title", type: "text", localized: true, defaultValue: "Results that speak for themselves" },
        { name: "description", type: "textarea", localized: true, defaultValue: "A closer look at how we approach real problems — and the outcomes we deliver." },
      ],
    },
    {
      type: "group",
      name: "team",
      label: "Team section heading",
      fields: [
        { name: "eyebrow", type: "text", localized: true, defaultValue: "Our people" },
        { name: "title", type: "text", localized: true, defaultValue: "The people behind the work" },
        { name: "description", type: "textarea", localized: true, defaultValue: "A close-knit team of designers, engineers and strategists." },
      ],
    },
    {
      name: "stats",
      type: "array",
      label: "Number stats",
      labels: { singular: "Stat", plural: "Stats" },
      admin: { description: "The animated numbers (e.g. 150+ Projects delivered)." },
      fields: [
        { name: "value", type: "text", required: true, admin: { description: "e.g. 150+, 98%, 24/7" } },
        { name: "label", type: "text", required: true, localized: true },
      ],
    },
    {
      type: "group",
      name: "cta",
      label: "Call-to-action block",
      fields: [
        { name: "title", type: "text", localized: true, defaultValue: "Ready to start your project?" },
        { name: "description", type: "textarea", localized: true, defaultValue: "Let's build something your customers will love. Tell us about your idea and we'll take it from there." },
        {
          type: "row",
          fields: [
            { name: "buttonLabel", type: "text", localized: true, defaultValue: "Start a project" },
            { name: "buttonHref", type: "text", defaultValue: "/contact" },
          ],
        },
      ],
    },
  ],
};
