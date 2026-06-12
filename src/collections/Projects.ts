import type { CollectionConfig } from "payload";
import { featuredField, orderField, slugField } from "@/lib/adminFields";

/** Portfolio projects — cards on /portfolio and the home page reel. */
export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Project", plural: "Portfolio" },
  admin: {
    useAsTitle: "title",
    group: "Content",
    defaultColumns: ["title", "category", "client", "year", "featured"],
    listSearchableFields: ["title", "client", "excerpt"],
    description:
      "Each project is a portfolio card with its own page. Use the tabs below — Basics is enough for the card; Story, Details and Gallery fill the project page.",
  },
  access: { read: () => true },
  defaultSort: "order",
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Basics",
          description: "Everything the portfolio card needs.",
          fields: [
            { name: "title", type: "text", required: true, localized: true },
            {
              type: "row",
              fields: [
                {
                  name: "category",
                  type: "select",
                  required: true,
                  options: ["E-Commerce", "Mobile", "Dashboard", "Branding", "Web App"],
                },
                { name: "client", type: "text", required: true },
                { name: "year", type: "number", required: true },
              ],
            },
            { name: "cover", type: "upload", relationTo: "media", required: true },
            {
              name: "excerpt",
              type: "textarea",
              required: true,
              localized: true,
              admin: { description: "Short line shown on the card." },
            },
            {
              name: "tags",
              type: "array",
              admin: { description: "Small chips on the card, e.g. Flutter, Laravel." },
              fields: [{ name: "tag", type: "text", required: true }],
            },
          ],
        },
        {
          label: "Story",
          description: "The narrative on the project page.",
          fields: [
            {
              name: "overview",
              type: "textarea",
              localized: true,
              admin: { description: "Long-form description shown at the top of the project page." },
            },
            { name: "challenge", type: "textarea", localized: true },
            { name: "solution", type: "textarea", localized: true },
            { name: "result", type: "textarea", localized: true },
          ],
        },
        {
          label: "Details",
          description: "Feature list and technologies.",
          fields: [
            {
              name: "features",
              type: "array",
              labels: { singular: "Feature", plural: "Key features" },
              fields: [{ name: "feature", type: "text", required: true, localized: true }],
            },
            {
              name: "techStack",
              type: "array",
              labels: { singular: "Technology", plural: "Tech stack" },
              fields: [{ name: "tech", type: "text", required: true }],
            },
          ],
        },
        {
          label: "Gallery",
          description: "App screens / extra images on the project page.",
          fields: [
            {
              name: "gallery",
              type: "array",
              labels: { singular: "Image", plural: "Gallery (app screens)" },
              fields: [{ name: "image", type: "upload", relationTo: "media", required: true }],
            },
          ],
        },
      ],
    },
    slugField("title"),
    orderField(),
    featuredField(),
  ],
};
