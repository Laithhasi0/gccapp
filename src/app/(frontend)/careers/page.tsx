import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { CareerForm } from "@/components/forms/CareerForm";
import { Editable } from "@/components/edit/Editable";
import { MapPin, Briefcase } from "lucide-react";
import { getCareers } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join GCC App. We're hiring engineers, designers and marketers who love their craft.",
};

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const careers = await getCareers();
  return (
    <>
      <Editable href="/admin/collections/careers" label="Careers">
        <Section>
          <SectionHeading
            eyebrow="Careers"
            title="Build great products with great people"
            description="We're a senior, close-knit team that values craft, ownership and balance."
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
            eyebrow="Apply"
            title="Tell us about yourself"
            description="Don't see your exact role? Apply anyway — we're always glad to meet talented people."
          />
          <div className="mt-10 rounded-[var(--radius-lg)] border border-border bg-background p-6 shadow-sm sm:p-8">
            <CareerForm />
          </div>
        </div>
      </Section>
    </>
  );
}
