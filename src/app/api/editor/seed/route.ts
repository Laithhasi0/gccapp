import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { importWebsiteContent } from "@/lib/seedContent";

/**
 * One-click "Import website content" used by the dashboard. Copies the
 * website's built-in content (Arabic + English + images) into the CMS so
 * everything on the site is editable. Only fills EMPTY collections.
 */
export async function POST(req: NextRequest) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: req.headers });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const report = await importWebsiteContent(payload);
    return NextResponse.json({ ok: true, report });
  } catch (err) {
    console.error("[seed] import failed", err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
