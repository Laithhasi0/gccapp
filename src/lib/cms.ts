import "server-only";
import { getPayload } from "payload";
import config from "@payload-config";
import { services as seedServices } from "@/content/services";
import { projects as seedProjects } from "@/content/projects";
import { site, stats as seedStats, processSteps as seedProcess } from "@/content/site";
import { caseStudies as seedCaseStudies } from "@/content/caseStudies";
import { faqs as seedFaqs } from "@/content/faqs";
import { careers as seedCareers, type Career } from "@/content/careers";
import {
  servicesAr,
  projectsAr,
  caseStudiesAr,
  faqsAr,
  careersAr,
  statsAr,
  processStepsAr,
  processMetaAr,
  heroDefaultsAr,
  siteDefaultsAr,
  homeSectionsAr,
  capabilitiesAr,
} from "@/content/ar";
import { iconFor } from "./serviceIcons";
import { getLocale } from "./getLocale";
import type { Locale } from "./i18n";
import type { Service, Project, CaseStudy, Faq, ProcessStep } from "@/content/types";

const isAr = (l: Locale) => l === "ar";

type MediaDoc = {
  url?: string | null;
  sizes?: Record<string, { url?: string | null } | undefined>;
};

function url(m: MediaDoc | string | null | undefined, size: string): string | undefined {
  if (!m || typeof m === "string") return undefined;
  return m.sizes?.[size]?.url || m.url || undefined;
}

/** Original (un-cropped) media URL — use for portrait/non-16:9 images like app screens. */
function originalUrl(m: MediaDoc | string | null | undefined): string | undefined {
  if (!m) return undefined;
  if (typeof m === "string") return m;
  return m.url || undefined;
}

/* ------------------------------- services -------------------------------- */

type ServiceDoc = {
  id?: number | string;
  slug: string;
  title: string;
  icon?: string;
  excerpt: string;
  image?: MediaDoc | string | null;
  body?: { text: string }[] | null;
  features?: { text: string }[] | null;
  seoDescription?: string | null;
};

function mapService(doc: ServiceDoc): Service {
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    icon: iconFor(doc.icon),
    excerpt: doc.excerpt,
    image: url(doc.image, "card") ?? "",
    body: (doc.body ?? []).map((b) => b.text),
    features: (doc.features ?? []).map((f) => f.text),
    seoDescription: doc.seoDescription || doc.excerpt,
  };
}

export async function getServices(): Promise<Service[]> {
  const locale = await getLocale();
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "services",
      sort: "order",
      depth: 1,
      limit: 100,
      locale,
    });
    if (res.docs.length) return (res.docs as unknown as ServiceDoc[]).map(mapService);
  } catch {
    // CMS unreachable — fall back to seed content.
  }
  return isAr(locale) ? servicesAr : seedServices;
}

export async function getService(slug: string): Promise<Service | undefined> {
  return (await getServices()).find((s) => s.slug === slug);
}

/* ------------------------------- projects -------------------------------- */

type ProjectDoc = {
  id?: number | string;
  slug: string;
  title: string;
  category: string;
  client: string;
  year: number;
  cover?: MediaDoc | string | null;
  excerpt: string;
  overview?: string | null;
  challenge?: string | null;
  solution?: string | null;
  result?: string | null;
  features?: { feature: string }[] | null;
  techStack?: { tech: string }[] | null;
  gallery?: { image?: MediaDoc | string | null }[] | null;
  tags?: { tag: string }[] | null;
};

function mapProject(doc: ProjectDoc): Project {
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    client: doc.client,
    year: doc.year,
    cover: url(doc.cover, "wide") ?? "",
    excerpt: doc.excerpt,
    overview: doc.overview ?? "",
    challenge: doc.challenge ?? "",
    solution: doc.solution ?? "",
    result: doc.result ?? "",
    features: (doc.features ?? []).map((f) => f.feature),
    techStack: (doc.techStack ?? []).map((t) => t.tech),
    gallery: (doc.gallery ?? [])
      .map((g) => originalUrl(g.image) ?? "")
      .filter(Boolean),
    tags: (doc.tags ?? []).map((t) => t.tag),
  };
}

export async function getProjects(): Promise<Project[]> {
  const locale = await getLocale();
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "projects",
      sort: "order",
      depth: 1,
      limit: 100,
      locale,
    });
    if (res.docs.length) return (res.docs as unknown as ProjectDoc[]).map(mapProject);
  } catch {
    // CMS unreachable — fall back to seed content.
  }
  return isAr(locale) ? projectsAr : seedProjects;
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((p) => p.slug === slug);
}

export async function getProjectCategories(): Promise<string[]> {
  const all = await getProjects();
  return ["All", ...Array.from(new Set(all.map((p) => p.category)))];
}

/* -------------------------------- globals -------------------------------- */

export type SiteSettings = {
  siteName: string;
  availabilityText: string;
  logo?: string;
  contact: { email: string; phone: string; phoneHref: string; address: string };
  footerBlurb: string;
  headerCta: { label: string; href: string };
  socials: { platform: string; url: string }[];
};

export type HeroData = {
  badge: string;
  headline: string;
  highlight: string;
  subheading: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  posterImage?: string;
  backgroundVideoUrl?: string;
  showStats: boolean;
  stats: { value: string; label: string }[];
};

export type AppearanceData = {
  theme: "dark" | "light";
  accentColor: string;
  accentHover: string;
  backgroundColor?: string;
};

async function findGlobal<T>(slug: string, locale: Locale): Promise<T | null> {
  try {
    const payload = await getPayload({ config });
    return (await payload.findGlobal({ slug, locale, depth: 1 })) as T;
  } catch {
    return null;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const locale = await getLocale();
  const ar = isAr(locale);
  const g = await findGlobal<Record<string, unknown>>("site-settings", locale);
  const contact = (g?.contact as SiteSettings["contact"]) || undefined;
  const cta = (g?.headerCta as { label?: string; href?: string }) || {};
  const socials = (g?.socials as { platform: string; url: string }[]) || [];
  return {
    siteName: (g?.siteName as string) || site.name,
    availabilityText:
      (g?.availabilityText as string) ||
      (ar ? siteDefaultsAr.availabilityText : "Available for projects"),
    logo: url(g?.logo as MediaDoc, "card"),
    contact: {
      email: contact?.email || site.contact.email,
      phone: contact?.phone || site.contact.phone,
      phoneHref: contact?.phoneHref || site.contact.phoneHref,
      address: contact?.address || (ar ? siteDefaultsAr.address : site.contact.address),
    },
    footerBlurb:
      (g?.footerBlurb as string) ||
      (ar
        ? siteDefaultsAr.footerBlurb
        : "GCC App delivers innovative digital solutions, apps and services designed to simplify your business operations and boost productivity."),
    headerCta: {
      label: cta.label || (ar ? siteDefaultsAr.headerCtaLabel : "Contact Us"),
      href: cta.href || "/contact",
    },
    socials: socials.length
      ? socials.map((s) => ({ platform: s.platform, url: s.url }))
      : site.socials.map((s) => ({ platform: s.icon, url: s.href })),
  };
}

export async function getHero(forLocale?: Locale): Promise<HeroData> {
  const locale = forLocale ?? (await getLocale());
  const ar = isAr(locale);
  const g = await findGlobal<Record<string, unknown>>("home-hero", locale);
  const p = (g?.primaryCta as { label?: string; href?: string }) || {};
  const s = (g?.secondaryCta as { label?: string; href?: string }) || {};
  const stats = (g?.stats as { value: string; label: string }[]) || [];
  const seedStatsForLocale = ar ? statsAr : seedStats;
  return {
    badge: (g?.badge as string) || (ar ? heroDefaultsAr.badge : "Digital solutions agency · Riyadh"),
    headline: (g?.headline as string) || (ar ? heroDefaultsAr.headline : "Level up your business with"),
    highlight: (g?.highlight as string) || (ar ? heroDefaultsAr.highlight : "GCC App"),
    subheading:
      (g?.subheading as string) ||
      (ar
        ? heroDefaultsAr.subheading
        : "We build powerful mobile applications, web applications and modern websites that help businesses grow and succeed in the digital world."),
    primaryCta: {
      label: p.label || (ar ? heroDefaultsAr.primaryCtaLabel : "Get Started"),
      href: p.href || "/contact",
    },
    secondaryCta: {
      label: s.label || (ar ? heroDefaultsAr.secondaryCtaLabel : "View Portfolio"),
      href: s.href || "/portfolio",
    },
    posterImage: url(g?.posterImage as MediaDoc, "wide") || "/media/images/15-og-share-card.webp",
    backgroundVideoUrl: (g?.backgroundVideoUrl as string) || "/media/video/hero-background-loop.mp4",
    showStats: g?.showStats !== false,
    stats: stats.length
      ? stats
      : seedStatsForLocale.map((st) => ({ value: `${st.prefix ?? ""}${st.value}${st.suffix ?? ""}`, label: st.label })),
  };
}

export async function getAppearance(): Promise<AppearanceData> {
  const locale = await getLocale();
  const g = await findGlobal<Record<string, unknown>>("appearance", locale);
  return {
    theme: ((g?.theme as string) === "light" ? "light" : "dark"),
    accentColor: (g?.accentColor as string) || "#25c9e2",
    accentHover: (g?.accentHover as string) || "#54d9ef",
    backgroundColor: (g?.backgroundColor as string) || undefined,
  };
}

/* ------------------------- more collections ------------------------------ */

async function findDocs<T>(collection: string, locale: Locale): Promise<T[] | null> {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: collection as never,
      sort: "order",
      depth: 1,
      limit: 100,
      locale,
    });
    return res.docs.length ? (res.docs as unknown as T[]) : null;
  } catch {
    return null;
  }
}

type CaseStudyDoc = {
  id?: number | string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  cover?: MediaDoc | string | null;
  metrics?: { label: string; value: string }[] | null;
  sections?: { heading: string; body: string }[] | null;
};

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const locale = await getLocale();
  const docs = await findDocs<CaseStudyDoc>("case-studies", locale);
  if (!docs) return isAr(locale) ? caseStudiesAr : seedCaseStudies;
  return docs.map((d) => ({
    id: d.id,
    slug: d.slug,
    title: d.title,
    category: d.category,
    summary: d.summary,
    cover: url(d.cover, "wide") ?? "",
    metrics: d.metrics ?? [],
    sections: d.sections ?? [],
  }));
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | undefined> {
  return (await getCaseStudies()).find((c) => c.slug === slug);
}

export async function getFaqs(): Promise<Faq[]> {
  const locale = await getLocale();
  const docs = await findDocs<Faq>("faqs", locale);
  return docs ?? (isAr(locale) ? faqsAr : seedFaqs);
}

export async function getCareers(): Promise<Career[]> {
  const locale = await getLocale();
  const docs = await findDocs<Career>("careers", locale);
  return docs ?? (isAr(locale) ? careersAr : seedCareers);
}

export async function getCareer(slug: string): Promise<Career | undefined> {
  return (await getCareers()).find((c) => c.slug === slug);
}

/* ----------------------------- home sections ----------------------------- */

export type ProcessData = {
  eyebrow: string;
  heading: string;
  description: string;
  steps: ProcessStep[];
};

export async function getProcess(forLocale?: Locale): Promise<ProcessData> {
  const locale = forLocale ?? (await getLocale());
  const ar = isAr(locale);
  const g = await findGlobal<Record<string, unknown>>("home-process", locale);
  const steps = (g?.steps as ProcessStep[]) || [];
  return {
    eyebrow: (g?.eyebrow as string) || (ar ? processMetaAr.eyebrow : "How we work"),
    heading: (g?.heading as string) || (ar ? processMetaAr.heading : "A clear, proven process"),
    description:
      (g?.description as string) ||
      (ar
        ? processMetaAr.description
        : "Six calm steps from first conversation to a confident launch — and the support that follows."),
    steps: steps.length ? steps : ar ? processStepsAr : seedProcess,
  };
}

export type Heading = { eyebrow: string; title: string; description?: string };
export type HomeSectionsData = {
  services: Heading;
  selectedWork: Heading;
  caseStudies: Heading;
  team: Heading;
  stats: { value: string; label: string }[];
  cta: { title: string; description: string; buttonLabel: string; buttonHref: string };
};

export const seedHomeSections: HomeSectionsData = {
  services: {
    eyebrow: "What we do",
    title: "Services built around outcomes",
    description: "From first idea to launch and growth, we cover the full digital product lifecycle.",
  },
  selectedWork: { eyebrow: "Selected work", title: "Projects we're proud of" },
  caseStudies: {
    eyebrow: "Case studies",
    title: "Results that speak for themselves",
    description: "A closer look at how we approach real problems — and the outcomes we deliver.",
  },
  team: {
    eyebrow: "Our people",
    title: "The people behind the work",
    description: "A close-knit team of designers, engineers and strategists.",
  },
  stats: seedStats.map((s) => ({ value: `${s.prefix ?? ""}${s.value}${s.suffix ?? ""}`, label: s.label })),
  cta: {
    title: "Ready to start your project?",
    description:
      "Let's build something your customers will love. Tell us about your idea and we'll take it from there.",
    buttonLabel: "Start a project",
    buttonHref: "/contact",
  },
};

const arHomeSections: HomeSectionsData = {
  services: homeSectionsAr.services,
  selectedWork: homeSectionsAr.selectedWork,
  caseStudies: homeSectionsAr.caseStudies,
  team: homeSectionsAr.team,
  stats: statsAr.map((s) => ({ value: `${s.prefix ?? ""}${s.value}${s.suffix ?? ""}`, label: s.label })),
  cta: {
    title: homeSectionsAr.cta.title,
    description: homeSectionsAr.cta.description,
    buttonLabel: homeSectionsAr.cta.buttonLabel,
    buttonHref: "/contact",
  },
};

export async function getHomeSections(forLocale?: Locale): Promise<HomeSectionsData> {
  const locale = forLocale ?? (await getLocale());
  const base = isAr(locale) ? arHomeSections : seedHomeSections;
  const g = await findGlobal<Record<string, unknown>>("home-sections", locale);
  if (!g) return base;
  const heading = (v: unknown, fb: Heading): Heading => {
    const h = (v as Partial<Heading>) || {};
    return { eyebrow: h.eyebrow || fb.eyebrow, title: h.title || fb.title, description: h.description ?? fb.description };
  };
  const stats = (g.stats as { value: string; label: string }[]) || [];
  const cta = (g.cta as Partial<HomeSectionsData["cta"]>) || {};
  return {
    services: heading(g.services, base.services),
    selectedWork: heading(g.selectedWork, base.selectedWork),
    caseStudies: heading(g.caseStudies, base.caseStudies),
    team: heading(g.team, base.team),
    stats: stats.length ? stats : base.stats,
    cta: {
      title: cta.title || base.cta.title,
      description: cta.description || base.cta.description,
      buttonLabel: cta.buttonLabel || base.cta.buttonLabel,
      buttonHref: cta.buttonHref || base.cta.buttonHref,
    },
  };
}

export type CapabilityItem = {
  image: string;
  eyebrow: string;
  title: string;
  text: string;
  href: string;
};

export const seedCapabilities: CapabilityItem[] = [
  { image: "/media/images/cap-design.webp", eyebrow: "Design & Brand", title: "Crafted with clarity", text: "Identity systems and interfaces designed around real people — clean, modern and effortless to use.", href: "/services/branding" },
  { image: "/media/images/cap-web.webp", eyebrow: "Web & Mobile", title: "Built to last", text: "Fast, robust web and mobile apps engineered on modern frameworks, with quality and accessibility baked in.", href: "/services/web-design" },
  { image: "/media/images/cap-commerce.webp", eyebrow: "Commerce & Product", title: "Made to scale", text: "Storefronts and digital products that load fast, convert well and grow with your business.", href: "/services/e-commerce" },
  { image: "/media/images/cap-growth.webp", eyebrow: "Marketing & Growth", title: "Made to grow", text: "Performance marketing and SEO that earn attention and compound into durable, measurable growth.", href: "/services/digital-marketing" },
];

const arCapabilities: CapabilityItem[] = seedCapabilities.map((c, i) => ({
  ...c,
  eyebrow: capabilitiesAr.items[i]?.eyebrow ?? c.eyebrow,
  title: capabilitiesAr.items[i]?.title ?? c.title,
  text: capabilitiesAr.items[i]?.text ?? c.text,
}));

export async function getCapabilities(forLocale?: Locale): Promise<{ eyebrow: string; items: CapabilityItem[] }> {
  const locale = forLocale ?? (await getLocale());
  const ar = isAr(locale);
  const g = await findGlobal<Record<string, unknown>>("home-capabilities", locale);
  const rawItems = (g?.items as Array<Record<string, unknown>>) || [];
  const items: CapabilityItem[] = rawItems.map((it) => ({
    image: url(it.image as MediaDoc, "card") ?? "",
    eyebrow: (it.eyebrow as string) || "",
    title: (it.title as string) || "",
    text: (it.text as string) || "",
    href: (it.href as string) || "/services",
  }));
  return {
    eyebrow: (g?.eyebrow as string) || (ar ? capabilitiesAr.eyebrow : "What we do"),
    items: items.length ? items : ar ? arCapabilities : seedCapabilities,
  };
}
