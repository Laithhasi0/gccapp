import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { CTASection } from "@/components/ui/CTASection";
import { ArrowLeft } from "lucide-react";
import { getCaseStudy } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.summary,
    openGraph: { images: [study.cover] },
  };
}

export default async function CaseStudyDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();

  return (
    <>
      <Section>
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" /> All case studies
        </Link>
        <Reveal className="mt-8 max-w-3xl">
          <Badge>{study.category}</Badge>
          <h1 className="mt-5">{study.title}</h1>
          <p className="mt-4 text-lg">{study.summary}</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <ParallaxImage
            src={study.cover}
            alt={study.title}
            priority
            sizes="100vw"
            amount={48}
            className="aspect-[16/9] rounded-[var(--radius-lg)] border border-border shadow-sm"
          />
        </Reveal>
      </Section>

      <section className="bg-surface-tint py-14">
        <Container>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {study.metrics.map((m) => (
              <div key={m.label} className="text-center">
                <div className="font-display text-4xl font-semibold text-accent">
                  {m.value}
                </div>
                <div className="mt-2 text-sm text-muted">{m.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Section tone="surface">
        <div className="mx-auto max-w-2xl space-y-10">
          {study.sections.map((s, i) => (
            <Reveal key={s.heading} delay={i * 0.05}>
              <h2 className="text-2xl">{s.heading}</h2>
              <p className="mt-3 text-ink/90">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection />
    </>
  );
}
