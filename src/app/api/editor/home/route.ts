import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { loadHomeSections, saveHomeSections } from "@/lib/homePage";
import type { HomeSection } from "@/lib/homeBlocks";

/**
 * Visual Editor backend: read / save the home page's sections.
 * Requires a logged-in CMS user (the admin cookie is sent automatically
 * because the editor runs on the same origin).
 */

async function requireUser(req: NextRequest) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: req.headers });
  return user;
}

function localeFrom(value: string | null): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export async function GET(req: NextRequest) {
  if (!(await requireUser(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const locale = localeFrom(req.nextUrl.searchParams.get("locale"));
  const data = await loadHomeSections(locale);
  return NextResponse.json({ ...data, locale });
}

export async function POST(req: NextRequest) {
  if (!(await requireUser(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { sections?: HomeSection[]; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!Array.isArray(body.sections)) {
    return NextResponse.json({ error: "sections must be an array" }, { status: 400 });
  }
  const locale = localeFrom(body.locale ?? null);
  try {
    await saveHomeSections(body.sections, locale);
  } catch (err) {
    const details = (err as { data?: { errors?: unknown[] } })?.data?.errors;
    console.error("[editor] save failed", err, details ? JSON.stringify(details, null, 2) : "");
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
  const data = await loadHomeSections(locale);
  return NextResponse.json({ ...data, locale });
}
