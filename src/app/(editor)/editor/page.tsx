import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { EditorApp } from "@/components/editor/EditorApp";

export const dynamic = "force-dynamic";

/**
 * Visual Editor — Shopify-style live editing of the home page.
 * Requires a logged-in CMS user; otherwise bounce to the admin login.
 */
export default async function EditorPage() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect("/admin/login");
  return <EditorApp />;
}
