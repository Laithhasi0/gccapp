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
} from "@/content/ar";
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

  return report;
}
