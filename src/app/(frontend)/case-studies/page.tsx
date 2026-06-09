import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { CTASection } from "@/components/ui/CTASection";
import { ArrowRight } from "lucide-react";
import { getCaseStudies } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "In-depth case studies showing how GCC App delivers measurable results for clients.",
};

export const dynamic = "force-dynamic";

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Case studies"
          title="How we deliver results"
          description="Real problems, clear approaches and the outcomes that followed."
        />
        <div className="mt-14 space-y-8">
          {caseStudies.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.05}>
              <Link
                href={`/case-studies/${c.slug}`}
                className="hover-lift group grid items-center gap-8 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-sm lg:grid-cols-2 lg:p-8"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius)] bg-surface-tint">
                  <Image
                    src={c.cover}
                    alt={c.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div>
                  <Badge>{c.category}</Badge>
                  <h3 className="mt-3 text-2xl group-hover:text-accent">{c.title}</h3>
                  <p className="mt-3">{c.summary}</p>
                  <div className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
                    {c.metrics.map((m) => (
                      <div key={m.label}>
                        <div className="font-display text-xl font-semibold text-accent">
                          {m.value}
                        </div>
                        <div className="text-xs text-muted">{m.label}</div>
                      </div>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                    Read case study
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
      <CTASection />
    </>
  );
}
