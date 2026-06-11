import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/Prose";
import { getLocale } from "@/lib/getLocale";
import { getUI } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of the GCC App website.",
};

export default async function TermsPage() {
  const t = getUI(await getLocale());
  const tm = t.pages.legal.terms;
  return (
    <LegalPage
      title={tm.title}
      updated={tm.updated}
      updatedLabel={t.pages.legal.updatedLabel}
      intro={tm.intro}
      blocks={tm.blocks}
    />
  );
}
