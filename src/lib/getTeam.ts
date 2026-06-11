import "server-only";
import { getPayload } from "payload";
import config from "@payload-config";
import { teamData, byOrder, initialsOf } from "@/content/team";
import { teamDataAr } from "@/content/ar";
import { getLocale } from "./getLocale";
import type { TeamMember, Department } from "@/content/types";

type MediaDoc = {
  url?: string | null;
  alt?: string | null;
  sizes?: Record<string, { url?: string | null } | undefined>;
};

type TeamDoc = {
  name: string;
  role: string;
  workingOn?: string | null;
  bio?: string | null;
  photo?: MediaDoc | string | null;
  department?: Department | null;
  socials?: {
    linkedin?: string | null;
    x?: string | null;
    github?: string | null;
    email?: string | null;
  } | null;
  order?: number | null;
  featured?: boolean | null;
};

function clean<T extends Record<string, unknown>>(obj: T): Partial<T> | undefined {
  const out = Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v != null && v !== ""),
  ) as Partial<T>;
  return Object.keys(out).length ? out : undefined;
}

function mapDoc(doc: TeamDoc): TeamMember {
  const photo = doc.photo && typeof doc.photo === "object" ? doc.photo : null;
  const photoUrl = photo?.sizes?.square?.url || photo?.url || undefined;
  return {
    name: doc.name,
    role: doc.role,
    workingOn: doc.workingOn || undefined,
    bio: doc.bio || undefined,
    photo: photoUrl,
    alt: photo?.alt || undefined,
    initials: initialsOf(doc.name),
    department: doc.department || undefined,
    socials: doc.socials
      ? clean({
          linkedin: doc.socials.linkedin || undefined,
          x: doc.socials.x || undefined,
          github: doc.socials.github || undefined,
          email: doc.socials.email || undefined,
        })
      : undefined,
    order: doc.order ?? undefined,
    featured: Boolean(doc.featured),
  };
}

/** All team members from the CMS, sorted by `order`. Falls back to seed data. */
export async function getTeam(): Promise<TeamMember[]> {
  const locale = await getLocale();
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "team",
      sort: "order",
      depth: 1,
      limit: 100,
      locale,
    });
    if (res.docs.length) return (res.docs as unknown as TeamDoc[]).map(mapDoc);
  } catch {
    // DB unreachable (e.g. build with no database) — use seed data.
  }
  const data = locale === "ar" ? teamDataAr : teamData;
  return [...data].sort(byOrder);
}

/** Featured members for the home-page variant. */
export async function getFeaturedTeam(limit = 4): Promise<TeamMember[]> {
  const all = await getTeam();
  return all.filter((m) => m.featured).slice(0, limit);
}
