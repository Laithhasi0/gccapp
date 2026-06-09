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
    // New uploads are stored + resized as compact WebP for fast serving.
    formatOptions: { format: "webp", options: { quality: 76 } },
    resizeOptions: { width: 1600, height: 1600, fit: "inside", withoutEnlargement: true },
    imageSizes: [
      { name: "thumbnail", width: 300, height: 300, crop: "center", formatOptions: { format: "webp", options: { quality: 74 } } },
      { name: "square", width: 640, height: 640, crop: "center", formatOptions: { format: "webp", options: { quality: 76 } } },
      { name: "card", width: 900, height: 900, crop: "center", formatOptions: { format: "webp", options: { quality: 76 } } },
      { name: "wide", width: 1600, height: 900, crop: "center", formatOptions: { format: "webp", options: { quality: 76 } } },
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
