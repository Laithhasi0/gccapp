import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { CareerForm } from "@/components/forms/CareerForm";
import { Editable } from "@/components/edit/Editable";
import { MapPin, Briefcase } from "lucide-react";
import { getCareers } from "@/lib/cms";
import { getLocale } from "@/lib/getLocale";
import { getUI } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join GCC App. We're hiring engineers, designers and marketers who love their craft.",
};

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const careers = await getCareers();
  const t = getUI(await getLocale());
  const roleOptions = careers.map((c) => c.role);
  return (
    <>
      <Editable href="/admin/collections/careers" label="Careers">
        <Section>
          <SectionHeading
            eyebrow={t.pages.careers.eyebrow}
            title={t.pages.careers.title}
            description={t.pages.careers.description}
          />
          <div className="mx-auto mt-14 max-w-3xl space-y-4">
          {careers.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.05}>
              <div className="hover-lift rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="text-lg">{c.role}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {c.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5" /> {c.type}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-sm">{c.description}</p>
              </div>
            </Reveal>
          ))}
          </div>
        </Section>
      </Editable>

      <Section tone="surface">
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            eyebrow={t.pages.careers.applyEyebrow}
            title={t.pages.careers.applyTitle}
            description={t.pages.careers.applyDescription}
          />
          <div className="mt-10 rounded-[var(--radius-lg)] border border-border bg-background p-6 shadow-sm sm:p-8">
            <CareerForm roleOptions={roleOptions} />
          </div>
        </div>
      </Section>
    </>
  );
}
