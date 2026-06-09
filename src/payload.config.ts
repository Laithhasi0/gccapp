import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { cloudStoragePlugin } from "@payloadcms/plugin-cloud-storage";
import { buildConfig } from "payload";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { replitObjectStorageAdapter } from "./lib/objectStorage";
import { postgresStorageAdapter } from "./lib/postgresStorage";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Team } from "./collections/Team";
import { Services } from "./collections/Services";
import { Projects } from "./collections/Projects";
import { CaseStudies } from "./collections/CaseStudies";
import { Faqs } from "./collections/Faqs";
import { Careers } from "./collections/Careers";
import { SiteSettings } from "./globals/SiteSettings";
import { HomeHero } from "./globals/HomeHero";
import { HomeProcess } from "./globals/HomeProcess";
import { HomeCapabilities } from "./globals/HomeCapabilities";
import { HomeSections } from "./globals/HomeSections";
import { Appearance } from "./globals/Appearance";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Media persistence. On-disk uploads are wiped on every Autoscale redeploy, so we
// always store uploads in durable storage instead. Default: the persistent Postgres
// database (zero setup). Optional upgrade: set OBJECT_STORAGE_ENABLED=true after
// creating an Object Storage bucket to store bytes in the bucket instead.
const objectStorageEnabled = process.env.OBJECT_STORAGE_ENABLED === "true";
const mediaAdapter = objectStorageEnabled
  ? replitObjectStorageAdapter()
  : postgresStorageAdapter();

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: "· GCC App CMS",
      description: "Manage everything on the GCC App website.",
    },
    components: {
      beforeDashboard: ["@/components/admin/Welcome#Welcome"],
    },
    livePreview: {
      url: ({ data, collectionConfig }) => {
        const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const slug = collectionConfig?.slug;
        if (slug === "services" && data?.slug) return `${base}/services/${data.slug}`;
        if (slug === "projects" && data?.slug) return `${base}/portfolio/${data.slug}`;
        if (slug === "case-studies" && data?.slug) return `${base}/case-studies/${data.slug}`;
        if (slug === "faqs") return `${base}/faq`;
        if (slug === "careers") return `${base}/careers`;
        if (slug === "team") return `${base}/about`;
        return base; // globals preview the home page
      },
      collections: ["services", "projects", "case-studies", "faqs", "careers", "team"],
      globals: ["site-settings", "home-hero", "home-process", "home-capabilities", "home-sections", "appearance"],
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 390, height: 844 },
        { label: "Tablet", name: "tablet", width: 768, height: 1024 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  collections: [Services, Projects, CaseStudies, Faqs, Careers, Team, Media, Users],
  globals: [SiteSettings, HomeHero, HomeProcess, HomeCapabilities, HomeSections, Appearance],
  plugins: [
    cloudStoragePlugin({
      collections: {
        media: {
          adapter: mediaAdapter,
          disableLocalStorage: true,
          prefix: "media",
        },
      },
    }),
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "dev-secret-change-me",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  localization: {
    locales: [
      { label: "English", code: "en" },
      { label: "العربية", code: "ar" },
    ],
    defaultLocale: "en",
    fallback: true,
  },
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URI || process.env.DATABASE_URL || "postgres://localhost:5432/gccapp",
    },
  }),
  sharp,
});
