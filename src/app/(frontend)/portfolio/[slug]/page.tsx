import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { CTASection } from "@/components/ui/CTASection";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getProjects, getProject } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.excerpt,
    openGraph: { images: [project.cover] },
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  const blocks: { label: string; body: string }[] = [
    { label: "Challenge", body: project.challenge },
    { label: "Solution", body: project.solution },
    { label: "Result", body: project.result },
  ];

  return (
    <>
      <Section>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" /> All projects
        </Link>
        <Reveal className="mt-8">
          <Badge>{project.category}</Badge>
          <h1 className="mt-5 max-w-3xl">{project.title}</h1>
          <p className="mt-4 max-w-2xl text-lg">{project.excerpt}</p>
          <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4 text-sm">
            <div>
              <dt className="text-muted">Client</dt>
              <dd className="mt-0.5 font-medium text-ink">{project.client}</dd>
            </div>
            <div>
              <dt className="text-muted">Year</dt>
              <dd className="mt-0.5 font-medium text-ink">{project.year}</dd>
            </div>
            <div>
              <dt className="text-muted">Stack</dt>
              <dd className="mt-0.5 font-medium text-ink">
                {project.tags.join(" · ")}
              </dd>
            </div>
          </dl>
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <ParallaxImage
            src={project.cover}
            alt={project.title}
            priority
            sizes="100vw"
            amount={48}
            className="aspect-[16/9] rounded-[var(--radius-lg)] border border-border shadow-sm"
          />
        </Reveal>
      </Section>

      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-3">
          {blocks.map((b, i) => (
            <Reveal key={b.label} delay={i * 0.06}>
              <h3 className="text-lg text-accent">{b.label}</h3>
              <p className="mt-3 text-ink/90">{b.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <Link
          href={`/portfolio/${next.slug}`}
          className="hover-lift group flex items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-surface p-8 shadow-sm"
        >
          <div>
            <span className="text-sm text-muted">Next project</span>
            <h3 className="mt-1 text-xl group-hover:text-accent">{next.title}</h3>
          </div>
          <ArrowRight className="h-6 w-6 text-accent transition-transform group-hover:translate-x-1" />
        </Link>
      </Section>

      <CTASection />
    </>
  );
}
