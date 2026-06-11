import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { CTASection } from "@/components/ui/CTASection";
import { Editable } from "@/components/edit/Editable";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { getProjects, getProject } from "@/lib/cms";
import { getLocale } from "@/lib/getLocale";
import { getUI } from "@/lib/i18n";

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
  const t = getUI(await getLocale());

  const stack = project.techStack?.length ? project.techStack : project.tags;
  const blocks: { label: string; body: string }[] = [
    { label: t.pages.portfolio.challenge, body: project.challenge },
    { label: t.pages.portfolio.solution, body: project.solution },
    { label: t.pages.portfolio.result, body: project.result },
  ].filter((b) => b.body);

  return (
    <Editable href="/admin/collections/projects" label="this project">
      <Section>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" /> {t.pages.portfolio.allProjects}
        </Link>
        <Reveal className="mt-8">
          <Badge>{t.categories[project.category] ?? project.category}</Badge>
          <h1 className="mt-5 max-w-3xl">{project.title}</h1>
          <p className="mt-4 max-w-2xl text-lg">{project.excerpt}</p>
          <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4 text-sm">
            <div>
              <dt className="text-muted">{t.pages.portfolio.client}</dt>
              <dd className="mt-0.5 font-medium text-ink">{project.client}</dd>
            </div>
            <div>
              <dt className="text-muted">{t.pages.portfolio.year}</dt>
              <dd className="mt-0.5 font-medium text-ink">{project.year}</dd>
            </div>
            <div>
              <dt className="text-muted">{t.pages.portfolio.category}</dt>
              <dd className="mt-0.5 font-medium text-ink">{t.categories[project.category] ?? project.category}</dd>
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

      {(project.overview || project.features?.length || stack?.length) && (
        <Section tone="surface">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {project.overview && (
                <Reveal>
                  <h2 className="text-2xl">{t.pages.portfolio.overview}</h2>
                  <p className="mt-4 whitespace-pre-line text-lg text-ink/90">
                    {project.overview}
                  </p>
                </Reveal>
              )}
              {project.features && project.features.length > 0 && (
                <Reveal delay={0.05} className="mt-10">
                  <h3 className="text-lg text-accent">{t.pages.portfolio.keyFeatures}</h3>
                  <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {project.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-sm text-ink/90">{f}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </div>

            {stack && stack.length > 0 && (
              <Reveal delay={0.1}>
                <aside className="rounded-[var(--radius-lg)] border border-border bg-background p-6 shadow-sm lg:sticky lg:top-24">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted">
                    {t.pages.portfolio.builtWith}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </aside>
              </Reveal>
            )}
          </div>
        </Section>
      )}

      {project.gallery && project.gallery.length > 0 && (
        <Section>
          <SectionHeading
            eyebrow={t.pages.portfolio.galleryEyebrow}
            title={t.pages.portfolio.galleryTitle}
            description={t.pages.portfolio.galleryDescription}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {project.gallery.map((src, i) => (
              <Reveal key={src} delay={i * 0.06}>
                <div className="relative aspect-[1/2] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-sm">
                  <Image
                    src={src}
                    alt={`${project.title} — ${t.pages.portfolio.galleryScreen} ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {blocks.length > 0 && (
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
      )}

      <Section>
        <Link
          href={`/portfolio/${next.slug}`}
          className="hover-lift group flex items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-surface p-8 shadow-sm"
        >
          <div>
            <span className="text-sm text-muted">{t.pages.portfolio.nextProject}</span>
            <h3 className="mt-1 text-xl group-hover:text-accent">{next.title}</h3>
          </div>
          <ArrowRight className="h-6 w-6 text-accent transition-transform group-hover:translate-x-1" />
        </Link>
      </Section>

      <CTASection />
    </Editable>
  );
}
