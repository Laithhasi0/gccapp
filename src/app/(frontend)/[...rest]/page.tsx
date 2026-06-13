import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * Catch-all for unmatched URLs inside the site, so visitors get the branded,
 * bilingual not-found page (with header/footer) instead of Next's default
 * English 404. More specific routes — including /admin, /editor and /api —
 * always win over this.
 */
export default function CatchAll(): never {
  notFound();
}
