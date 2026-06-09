"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import type { Project } from "@/content/types";

function ProjectPanel({ project }: { project: Project }) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group relative flex w-[84vw] shrink-0 snap-center flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-lg sm:w-[56vw] lg:w-[38vw]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          sizes="(max-width: 1024px) 84vw, 38vw"
          className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.05]"
        />
        <span className="absolute left-4 top-4">
          <Badge className="glass">{project.category}</Badge>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl transition-colors group-hover:text-accent">
            {project.title}
          </h3>
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <p className="mt-2 flex-1 text-sm">{project.excerpt}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-surface-tint px-2.5 py-1 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function EndPanel() {
  return (
    <Link
      href="/portfolio"
      className="group flex w-[64vw] shrink-0 snap-center flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-accent/40 bg-surface/60 p-8 text-center sm:w-[36vw] lg:w-[22vw]"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-contrast transition-transform group-hover:scale-110">
        <ArrowUpRight className="h-6 w-6" />
      </span>
      <span className="font-display text-lg font-semibold text-ink">
        View all projects
      </span>
    </Link>
  );
}

function Panels({ projects }: { projects: Project[] }) {
  return (
    <>
      {projects.map((p) => (
        <ProjectPanel key={p.slug} project={p} />
      ))}
      <EndPanel />
    </>
  );
}

/**
 * Horizontal "selected work" reel. The section pins to the viewport while the
 * track scrolls sideways, driven by GSAP ScrollTrigger (which is wired to Lenis
 * smooth scrolling in SmoothScroll.tsx). On touch / reduced-motion it degrades
 * to a normal horizontal swipe carousel.
 */
export function HorizontalShowcase({ projects }: { projects: Project[] }) {
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const sectionEl = section.current;
    const trackEl = track.current;
    if (!sectionEl || !trackEl) return;

    gsap.registerPlugin(ScrollTrigger);

    const distance = () =>
      Math.max(0, trackEl.scrollWidth - window.innerWidth + 32);

    const ctx = gsap.context(() => {
      gsap.to(trackEl, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: pin.current,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    // Recompute once images/fonts settle so the travel distance is accurate.
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 600);

    return () => {
      window.clearTimeout(t);
      ctx.revert();
    };
  }, [reduce, projects.length]);

  const Heading = (
    <Container className="shrink-0">
      <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
        Selected work
      </span>
      <h2 className="mt-2 max-w-2xl">
        Projects we&apos;re <span className="text-gradient">proud of</span>
      </h2>
    </Container>
  );

  // Reduced motion: a plain swipeable carousel — always fully reachable.
  if (reduce) {
    return (
      <section id="work" className="bg-surface-tint py-16 sm:py-20">
        {Heading}
        <div className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 sm:px-6 lg:px-8">
          <Panels projects={projects} />
        </div>
      </section>
    );
  }

  return (
    <section id="work" ref={section} className="relative bg-surface-tint">
      <div
        ref={pin}
        className="flex h-screen flex-col justify-center gap-8 overflow-hidden pt-16"
      >
        {Heading}
        <div
          ref={track}
          className="flex gap-6 px-5 will-change-transform sm:px-6 lg:px-8"
        >
          <Panels projects={projects} />
        </div>
      </div>
    </section>
  );
}
