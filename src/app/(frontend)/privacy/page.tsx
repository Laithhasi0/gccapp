import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/Prose";
import { getLocale } from "@/lib/getLocale";
import { getUI } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How GCC App collects, uses and protects your information.",
};

export default async function PrivacyPage() {
  const t = getUI(await getLocale());
  const p = t.pages.legal.privacy;
  return (
    <LegalPage
      title={p.title}
      updated={p.updated}
      updatedLabel={t.pages.legal.updatedLabel}
      intro={p.intro}
      blocks={p.blocks}
    />
  );
}
