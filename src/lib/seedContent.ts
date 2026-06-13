import "server-only";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { Pool } from "pg";
import type { Payload } from "payload";
import { services as seedServices } from "@/content/services";
import { projects as seedProjects } from "@/content/projects";
import { caseStudies as seedCaseStudies } from "@/content/caseStudies";
import { faqs as seedFaqs } from "@/content/faqs";
import { careers as seedCareers } from "@/content/careers";
import { teamData } from "@/content/team";
import {
  servicesAr,
  projectsAr,
  caseStudiesAr,
  faqsAr,
  careersAr,
  teamDataAr,
  capabilitiesAr,
  heroDefaultsAr,
  homeSectionsAr,
  processMetaAr,
  processStepsAr,
  siteDefaultsAr,
  statsAr,
} from "@/content/ar";
import { site, stats as seedStats, processSteps as seedProcessSteps } from "@/content/site";
import { seedCapabilities, seedHomeSections } from "./cms";
import { serviceIcons } from "./serviceIcons";

/**
 * One-click content import: copies the website's built-in content (with its
 * Arabic AND English text, and all images) into the CMS collections, so that
 * everything visible on the site exists in the dashboard and is editable.
 *
 * Idempotent and non-destructive: a collection is only seeded when it is
 * EMPTY — existing content is never touched. Because the site renders CMS
 * content when present (falling back to these same seeds when absent), the
 * website looks identical before and after the import.
 */

type AnyObj = Record<string, unknown>;

const MIME: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

async function ensureMedia(
  payload: Payload,
  cache: Map<string, number | string | null>,
  urlPath: string | undefined,
  alt: string,
): Promise<number | string | null> {
  if (!urlPath) return null;
  const hit = cache.get(urlPath);
  if (hit !== undefined) return hit;

  const filename = path.basename(urlPath);
  try {
    const existing = await payload.find({
      collection: "media" as never,
      where: { filename: { equals: filename } } as never,
      limit: 1,
      depth: 0,
    });
    const doc = existing.docs[0] as { id: number | string } | undefined;
    if (doc) {
      cache.set(urlPath, doc.id);
      return doc.id;
    }

    const filePath = path.join(process.cwd(), "public", urlPath.replace(/^\//, ""));
    if (!existsSync(filePath)) {
      cache.set(urlPath, null);
      return null;
    }
    const data = readFileSync(filePath);
    const created = (await payload.create({
      collection: "media" as never,
      data: { alt } as never,
      file: {
        data,
        name: filename,
        mimetype: MIME[path.extname(filename).toLowerCase()] ?? "application/octet-stream",
        size: data.length,
      },
    })) as { id: number | string };
    cache.set(urlPath, created.id);
    return created.id;
  } catch (err) {
    console.error("[seed] media failed for", urlPath, err);
    cache.set(urlPath, null);
    return null;
  }
}

async function isEmpty(payload: Payload, collection: string): Promise<boolean> {
  const res = await payload.find({ collection: collection as never, limit: 1, depth: 0 });
  return res.docs.length === 0;
}

/** Rows of a created doc (used to address rows by id when adding Arabic text). */
const rowsOf = (doc: AnyObj, field: string): AnyObj[] => (doc[field] as AnyObj[]) ?? [];

const iconNameOf = (icon: unknown): string =>
  Object.entries(serviceIcons).find(([, c]) => c === icon)?.[0] ?? "globe";

export type SeedReport = Record<string, string>;

/* ------------------------- Arabic translation repair ------------------------ */

/**
 * Known English seed phrases → their Arabic translations. An early seeding
 * script wrote English text into the ARABIC locale of the site-settings and
 * home-* globals; this maps every such known phrase to the correct Arabic so
 * it can be repaired in place. Only EXACT matches of these seed strings are
 * ever touched — anything the user typed themselves is left alone.
 */
function buildArabicFixes(): Map<string, string> {
  const m = new Map<string, string>();
  const add = (en: string | undefined, ar: string | undefined) => {
    if (en && ar && en !== ar) m.set(en, ar);
  };

  // Site settings
  add("Available for projects", siteDefaultsAr.availabilityText);
  add("Contact Us", siteDefaultsAr.headerCtaLabel);
  add(site.contact.address, siteDefaultsAr.address);
  add(
    "GCC App delivers innovative digital solutions, apps and services designed to simplify your business operations and boost productivity.",
    siteDefaultsAr.footerBlurb,
  );

  // Hero
  add("Digital solutions agency · Riyadh", heroDefaultsAr.badge);
  add("Level up your business with", heroDefaultsAr.headline);
  add(
    "We build powerful mobile applications, web applications and modern websites that help businesses grow and succeed in the digital world.",
    heroDefaultsAr.subheading,
  );
  add("Get Started", heroDefaultsAr.primaryCtaLabel);
  add("View Portfolio", heroDefaultsAr.secondaryCtaLabel);

  // Home section headings + CTA
  for (const key of ["services", "selectedWork", "caseStudies", "team"] as const) {
    const en = seedHomeSections[key] as { eyebrow: string; title: string; description?: string };
    const ar = homeSectionsAr[key] as { eyebrow: string; title: string; description?: string };
    add(en.eyebrow, ar.eyebrow);
    add(en.title, ar.title);
    add(en.description, ar.description);
  }
  add(seedHomeSections.cta.title, homeSectionsAr.cta.title);
  add(seedHomeSections.cta.description, homeSectionsAr.cta.description);
  add(seedHomeSections.cta.buttonLabel, homeSectionsAr.cta.buttonLabel);

  // Process
  add("How we work", processMetaAr.eyebrow);
  add("A clear, proven process", processMetaAr.heading);
  add(
    "Six calm steps from first conversation to a confident launch — and the support that follows.",
    processMetaAr.description,
  );
  seedProcessSteps.forEach((st, i) => {
    add(st.title, processStepsAr[i]?.title);
    add(st.description, processStepsAr[i]?.description);
  });

  // Capabilities
  add("What we do", capabilitiesAr.eyebrow);
  seedCapabilities.forEach((c, i) => {
    add(c.eyebrow, capabilitiesAr.items[i]?.eyebrow);
    add(c.title, capabilitiesAr.items[i]?.title);
    add(c.text, capabilitiesAr.items[i]?.text);
  });

  // Stats labels
  seedStats.forEach((st, i) => add(st.label, statsAr[i]?.label));

  return m;
}

function fixStringsDeep(value: unknown, fixes: Map<string, string>, hits: { n: number }): unknown {
  if (typeof value === "string") {
    const fixed = fixes.get(value);
    if (fixed !== undefined) {
      hits.n++;
      return fixed;
    }
    return value;
  }
  if (Array.isArray(value)) return value.map((v) => fixStringsDeep(v, fixes, hits));
  if (value && typeof value === "object") {
    const out: AnyObj = {};
    for (const [k, v] of Object.entries(value as AnyObj)) out[k] = fixStringsDeep(v, fixes, hits);
    return out;
  }
  return value;
}

/**
 * Drops nulls and empty objects so the repair update only carries real values —
 * otherwise untouched-but-empty required fields (e.g. an unfilled contact
 * group) make Payload reject the whole update.
 */
function pruneEmpty(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(pruneEmpty);
  if (value && typeof value === "object") {
    const out: AnyObj = {};
    for (const [k, v] of Object.entries(value as AnyObj)) {
      if (v === null || v === undefined) continue;
      const pv = pruneEmpty(v);
      if (pv && typeof pv === "object" && !Array.isArray(pv) && Object.keys(pv).length === 0) continue;
      out[k] = pv;
    }
    return out;
  }
  return value;
}

/**
 * Fills required fields that the legacy seeding left EMPTY in the stored
 * globals (they fail whole-document validation on any update otherwise).
 * Only ever writes the same defaults the site already shows via fallbacks,
 * so nothing changes visually — the documents just become valid + Arabic.
 */
function backfillRequired(slug: string, data: AnyObj, locale: "ar" | "en"): number {
  let n = 0;
  const isAr = locale === "ar";
  const fill = (obj: AnyObj, key: string, value: string | undefined) => {
    if (value && (obj[key] === null || obj[key] === undefined || obj[key] === "")) {
      obj[key] = value;
      n++;
    }
  };
  if (slug === "site-settings") {
    const contact = (data.contact ??= {}) as AnyObj;
    fill(contact, "email", site.contact.email);
    fill(contact, "phone", site.contact.phone);
    fill(contact, "phoneHref", site.contact.phoneHref);
    fill(contact, "address", isAr ? siteDefaultsAr.address : site.contact.address);
    fill(data, "availabilityText", isAr ? siteDefaultsAr.availabilityText : "Available for projects");
    fill(
      data,
      "footerBlurb",
      isAr
        ? siteDefaultsAr.footerBlurb
        : "GCC App delivers innovative digital solutions, apps and services designed to simplify your business operations and boost productivity.",
    );
    const cta = (data.headerCta ??= {}) as AnyObj;
    fill(cta, "label", isAr ? siteDefaultsAr.headerCtaLabel : "Contact Us");
  }
  if (slug === "home-hero") {
    fill(data, "headline", isAr ? heroDefaultsAr.headline : "Level up your business with");
    fill(data, "badge", isAr ? heroDefaultsAr.badge : "Digital solutions agency · Riyadh");
    fill(
      data,
      "subheading",
      isAr
        ? heroDefaultsAr.subheading
        : "We build powerful mobile applications, web applications and modern websites that help businesses grow and succeed in the digital world.",
    );
    ((data.stats as AnyObj[]) ?? []).forEach((row, i) =>
      fill(row, "label", isAr ? statsAr[i]?.label : seedStats[i]?.label),
    );
  }
  if (slug === "home-sections") {
    for (const key of ["services", "selectedWork", "caseStudies", "team"] as const) {
      const group = (data[key] ??= {}) as AnyObj;
      const src = (isAr ? homeSectionsAr[key] : seedHomeSections[key]) as {
        eyebrow?: string;
        title?: string;
        description?: string;
      };
      fill(group, "eyebrow", src.eyebrow);
      fill(group, "title", src.title);
      fill(group, "description", src.description);
    }
    const cta = (data.cta ??= {}) as AnyObj;
    const ctaSrc = isAr ? homeSectionsAr.cta : seedHomeSections.cta;
    fill(cta, "title", ctaSrc.title);
    fill(cta, "description", ctaSrc.description);
    fill(cta, "buttonLabel", ctaSrc.buttonLabel);
  }
  if (slug === "home-process") {
    fill(data, "eyebrow", isAr ? processMetaAr.eyebrow : "How we work");
    fill(data, "heading", isAr ? processMetaAr.heading : "A clear, proven process");
    ((data.steps as AnyObj[]) ?? []).forEach((row, i) => {
      fill(row, "title", isAr ? processStepsAr[i]?.title : seedProcessSteps[i]?.title);
      fill(row, "description", isAr ? processStepsAr[i]?.description : seedProcessSteps[i]?.description);
    });
  }
  if (slug === "home-capabilities") {
    ((data.items as AnyObj[]) ?? []).forEach((row, i) => {
      const src = isAr ? capabilitiesAr.items[i] : seedCapabilities[i];
      fill(row, "eyebrow", src?.eyebrow);
      fill(row, "title", src?.title);
      fill(row, "text", src?.text);
    });
  }
  return n;
}

const FIXABLE_GLOBALS = [
  "site-settings",
  "home-page",
  "home-hero",
  "home-sections",
  "home-process",
  "home-capabilities",
];

/**
 * Repairs both languages of the fixable globals:
 *  - Arabic: replaces known English seed phrases saved in the ar locale and
 *    fills empty required fields with the Arabic defaults.
 *  - English: fills empty fields with the English defaults, so nothing in the
 *    en locale falls back to Arabic text.
 */
async function repairArabicGlobals(payload: Payload): Promise<number> {
  const fixes = buildArabicFixes();
  let total = 0;
  for (const locale of ["ar", "en"] as const) {
    for (const slug of FIXABLE_GLOBALS) {
      try {
        const doc = (await payload.findGlobal({
          slug: slug as never,
          locale,
          depth: 0,
          fallbackLocale: false,
        })) as AnyObj | null;
        if (!doc) continue;
        const data: AnyObj = { ...doc };
        delete data.id;
        delete data.globalType;
        delete data.createdAt;
        delete data.updatedAt;
        const hits = { n: 0 };
        const fixed = (locale === "ar" ? fixStringsDeep(data, fixes, hits) : data) as AnyObj;
        hits.n += backfillRequired(slug, fixed, locale);
        if (hits.n > 0) {
          await payload.updateGlobal({
            slug: slug as never,
            locale,
            data: pruneEmpty(fixed) as never,
          });
          total += hits.n;
        }
      } catch (err) {
        console.error(`[seed] ${locale} repair failed for`, slug, err);
      }
    }
  }
  return total;
}


const SEED_LOCK_KEY = 427711; // dedicated advisory-lock id for content auto-seed

/**
 * Auto-seed used on server startup (payload.config `onInit`). Runs the content
 * import exactly once for a brand-new database, then records a marker so it
 * never runs again. This is what stops a redeploy from resurrecting content the
 * user intentionally deleted from the dashboard — the per-collection "only fill
 * if empty" rule alone can't tell "never seeded" apart from "user emptied it".
 *
 * Concurrency-safe on Autoscale: the advisory lock is taken with
 * `pg_try_advisory_lock` (non-blocking), so a second cold-starting instance
 * simply skips instead of waiting — startup is never delayed or blocked.
 * Returns the seed report when it seeded, or `null` when it skipped.
 */
export async function autoSeedOnInit(payload: Payload): Promise<SeedReport | null> {
  const connectionString = process.env.DATABASE_URI || process.env.DATABASE_URL;
  if (!connectionString) return null; // no DB URL — leave it to the manual button
  const pool = new Pool({ connectionString, max: 1, allowExitOnIdle: true });
  const client = await pool.connect();
  let locked = false;
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS app_seed_state (
         id         integer PRIMARY KEY DEFAULT 1,
         seeded_at  timestamptz NOT NULL DEFAULT now(),
         CONSTRAINT app_seed_state_singleton CHECK (id = 1)
       )`,
    );
    const lock = await client.query<{ ok: boolean }>(
      "SELECT pg_try_advisory_lock($1) AS ok",
      [SEED_LOCK_KEY],
    );
    locked = lock.rows[0]?.ok === true;
    if (!locked) return null; // another instance holds the lock / is seeding — skip
    const already = await client.query("SELECT 1 FROM app_seed_state WHERE id = 1");
    if ((already.rowCount ?? 0) > 0) return null; // already auto-seeded once — skip
    const report = await importWebsiteContent(payload);
    await client.query(
      "INSERT INTO app_seed_state (id) VALUES (1) ON CONFLICT (id) DO NOTHING",
    );
    return report;
  } finally {
    if (locked) {
      try {
        await client.query("SELECT pg_advisory_unlock($1)", [SEED_LOCK_KEY]);
      } catch {
        /* lock auto-releases when the session ends on pool.end() below */
      }
    }
    client.release();
    await pool.end();
  }
}

/**
 * Copies the site's built-in bilingual content + images into the CMS
 * collections. Idempotent and non-destructive: each collection is filled only
 * when it is still empty, so existing or edited content is never touched. Safe
 * to call repeatedly — the manual "Import website content" button uses this.
 */
export async function importWebsiteContent(payload: Payload): Promise<SeedReport> {
  const report: SeedReport = {};
  const media = new Map<string, number | string | null>();

  /* -------------------------------- services ------------------------------- */
  if (await isEmpty(payload, "services")) {
    let n = 0;
    for (const [i, s] of seedServices.entries()) {
      const ar = servicesAr.find((a) => a.slug === s.slug);
      const image = await ensureMedia(payload, media, s.image, s.title);
      const created = (await payload.create({
        collection: "services" as never,
        locale: "en",
        data: {
          title: s.title,
          slug: s.slug,
          icon: iconNameOf(s.icon),
          excerpt: s.excerpt,
          image,
          body: s.body.map((text) => ({ text })),
          features: s.features.map((text) => ({ text })),
          seoDescription: s.seoDescription,
          order: i + 1,
        } as never,
      })) as AnyObj;
      if (ar) {
        await payload.update({
          collection: "services" as never,
          id: created.id as never,
          locale: "ar",
          data: {
            title: ar.title,
            excerpt: ar.excerpt,
            seoDescription: ar.seoDescription,
            body: rowsOf(created, "body").map((row, j) => ({ id: row.id, text: ar.body[j] ?? s.body[j] })),
            features: rowsOf(created, "features").map((row, j) => ({ id: row.id, text: ar.features[j] ?? s.features[j] })),
          } as never,
        });
      }
      n++;
    }
    report.services = `imported ${n}`;
  } else {
    report.services = "already has content — skipped";
  }

  /* -------------------------------- projects ------------------------------- */
  if (await isEmpty(payload, "projects")) {
    let n = 0;
    for (const [i, p] of seedProjects.entries()) {
      const ar = projectsAr.find((a) => a.slug === p.slug);
      const cover = await ensureMedia(payload, media, p.cover, p.title);
      const gallery: AnyObj[] = [];
      for (const [gi, g] of (p.gallery ?? []).entries()) {
        const img = await ensureMedia(payload, media, g, `${p.title} — screen ${gi + 1}`);
        if (img) gallery.push({ image: img });
      }
      const created = (await payload.create({
        collection: "projects" as never,
        locale: "en",
        data: {
          title: p.title,
          slug: p.slug,
          category: p.category,
          client: p.client,
          year: p.year,
          cover,
          excerpt: p.excerpt,
          overview: p.overview,
          challenge: p.challenge,
          solution: p.solution,
          result: p.result,
          features: (p.features ?? []).map((feature) => ({ feature })),
          techStack: (p.techStack ?? []).map((tech) => ({ tech })),
          gallery,
          tags: p.tags.map((tag) => ({ tag })),
          order: i + 1,
          featured: true,
        } as never,
      })) as AnyObj;
      if (ar) {
        await payload.update({
          collection: "projects" as never,
          id: created.id as never,
          locale: "ar",
          data: {
            title: ar.title,
            excerpt: ar.excerpt,
            overview: ar.overview,
            challenge: ar.challenge,
            solution: ar.solution,
            result: ar.result,
            features: rowsOf(created, "features").map((row, j) => ({
              id: row.id,
              feature: ar.features?.[j] ?? p.features?.[j] ?? "",
            })),
          } as never,
        });
      }
      n++;
    }
    report.projects = `imported ${n}`;
  } else {
    report.projects = "already has content — skipped";
  }

  /* ------------------------------ case studies ----------------------------- */
  if (await isEmpty(payload, "case-studies")) {
    let n = 0;
    for (const [i, c] of seedCaseStudies.entries()) {
      const ar = caseStudiesAr.find((a) => a.slug === c.slug);
      const cover = await ensureMedia(payload, media, c.cover, c.title);
      const created = (await payload.create({
        collection: "case-studies" as never,
        locale: "en",
        data: {
          title: c.title,
          slug: c.slug,
          category: c.category,
          order: i + 1,
          summary: c.summary,
          cover,
          metrics: c.metrics.map((m) => ({ value: m.value, label: m.label })),
          sections: c.sections.map((s) => ({ heading: s.heading, body: s.body })),
        } as never,
      })) as AnyObj;
      if (ar) {
        await payload.update({
          collection: "case-studies" as never,
          id: created.id as never,
          locale: "ar",
          data: {
            title: ar.title,
            summary: ar.summary,
            metrics: rowsOf(created, "metrics").map((row, j) => ({
              id: row.id,
              value: c.metrics[j]?.value ?? "",
              label: ar.metrics[j]?.label ?? c.metrics[j]?.label ?? "",
            })),
            sections: rowsOf(created, "sections").map((row, j) => ({
              id: row.id,
              heading: ar.sections[j]?.heading ?? c.sections[j]?.heading ?? "",
              body: ar.sections[j]?.body ?? c.sections[j]?.body ?? "",
            })),
          } as never,
        });
      }
      n++;
    }
    report["case-studies"] = `imported ${n}`;
  } else {
    report["case-studies"] = "already has content — skipped";
  }

  /* ---------------------------------- faqs --------------------------------- */
  if (await isEmpty(payload, "faqs")) {
    let n = 0;
    for (const [i, f] of seedFaqs.entries()) {
      const ar = faqsAr[i];
      const created = (await payload.create({
        collection: "faqs" as never,
        locale: "en",
        data: { question: f.question, answer: f.answer, category: f.category, order: i + 1 } as never,
      })) as AnyObj;
      if (ar) {
        await payload.update({
          collection: "faqs" as never,
          id: created.id as never,
          locale: "ar",
          data: { question: ar.question, answer: ar.answer, category: ar.category } as never,
        });
      }
      n++;
    }
    report.faqs = `imported ${n}`;
  } else {
    report.faqs = "already has content — skipped";
  }

  /* --------------------------------- careers ------------------------------- */
  if (await isEmpty(payload, "careers")) {
    let n = 0;
    for (const [i, c] of seedCareers.entries()) {
      const ar = careersAr.find((a) => a.slug === c.slug);
      const created = (await payload.create({
        collection: "careers" as never,
        locale: "en",
        data: {
          role: c.role,
          slug: c.slug,
          location: c.location,
          type: c.type,
          description: c.description,
          order: i + 1,
        } as never,
      })) as AnyObj;
      if (ar) {
        await payload.update({
          collection: "careers" as never,
          id: created.id as never,
          locale: "ar",
          data: { role: ar.role, location: ar.location, type: ar.type, description: ar.description } as never,
        });
      }
      n++;
    }
    report.careers = `imported ${n}`;
  } else {
    report.careers = "already has content — skipped";
  }

  /* ---------------------------------- team --------------------------------- */
  if (await isEmpty(payload, "team")) {
    let n = 0;
    for (const [i, m] of teamData.entries()) {
      const ar = teamDataAr[i];
      const photo = m.photo ? await ensureMedia(payload, media, m.photo, m.alt ?? m.name) : null;
      const created = (await payload.create({
        collection: "team" as never,
        locale: "en",
        data: {
          name: m.name,
          role: m.role,
          workingOn: m.workingOn,
          bio: m.bio,
          ...(photo ? { photo } : {}),
          department: m.department,
          socials: m.socials,
          order: m.order ?? i + 1,
          featured: Boolean(m.featured),
        } as never,
      })) as AnyObj;
      if (ar) {
        await payload.update({
          collection: "team" as never,
          id: created.id as never,
          locale: "ar",
          data: {
            name: ar.name,
            role: ar.role,
            workingOn: ar.workingOn,
            bio: ar.bio,
          } as never,
        });
      }
      n++;
    }
    report.team = `imported ${n}`;
  } else {
    report.team = "already has content — skipped";
  }

  const repaired = await repairArabicGlobals(payload);
  report["arabic-text"] = repaired > 0 ? `repaired ${repaired} untranslated values` : "all good";

  return report;
}
