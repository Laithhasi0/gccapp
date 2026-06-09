import type { CollectionConfig } from "payload";
import path from "path";

/** Uploaded media with responsive sizes + a centered square crop, alt required. */
export const Media: CollectionConfig = {
  slug: "media",
  admin: { group: "Content" },
  access: { read: () => true },
  upload: {
    staticDir: path.resolve(process.cwd(), "public/media/uploads"),
    mimeTypes: ["image/*"],
    focalPoint: true,
    imageSizes: [
      { name: "thumbnail", width: 300, height: 300, crop: "center" },
      { name: "square", width: 640, height: 640, crop: "center" },
      { name: "card", width: 900, height: 900, crop: "center" },
      { name: "wide", width: 1600, height: 900, crop: "center" },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: { description: "Describe the image for screen readers and SEO." },
    },
  ],
};
