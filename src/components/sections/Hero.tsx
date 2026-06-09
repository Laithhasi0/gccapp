"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { useLivePreview } from "@payloadcms/live-preview-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { HeroVisual } from "@/components/three/HeroVisual";
import type { HeroData } from "@/lib/cms";

/**
 * Hero — a real-time live-preview component. For normal visitors `useLivePreview`
 * is a no-op and just renders `initialData`; inside the Payload live-preview
 * iframe it updates the hero AS YOU TYPE.
 */
export function Hero({ initialData }: { initialData: HeroData }) {
  const { data } = useLivePreview<HeroData>({
    initialData,
    serverURL: typeof window !== "undefined" ? window.location.origin : "",
    depth: 2,
  });
  // The hook receives whichever document is being edited; only apply data that
  // is actually the hero (so editing another global doesn't blank the hero).
  const hero =
    data && "headline" in (data as Record<string, unknown>) ? data : initialData;

  return (
    <section className="relative overflow-hidden">
      {/* Animated 3D tech object (lazy, desktop-only, paused off-screen) */}
      <HeroVisual />

      {/* Readability overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_58%_52%_at_50%_44%,var(--background)_18%,transparent_78%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />

      <Container className="relative py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          {hero.badge && (
            <Reveal>
              <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-accent shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                {hero.badge}
              </span>
            </Reveal>
          )}
          <Reveal delay={0.08}>
            <h1 className="mt-7 text-balance">
              {hero.headline}{" "}
              {hero.highlight && (
                <span className="text-gradient">{hero.highlight}</span>
              )}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-6 max-w-xl text-lg">{hero.subheading}</p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button href={hero.primaryCta.href} size="lg" className="group">
                {hero.primaryCta.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                href={hero.secondaryCta.href}
                variant="ghost"
                size="lg"
                className="glass"
              >
                {hero.secondaryCta.label}
              </Button>
            </div>
          </Reveal>

          {/* Trust strip */}
          {hero.showStats && hero.stats.length > 0 && (
            <Reveal delay={0.34}>
              <div className="mx-auto mt-14 grid max-w-lg grid-cols-2 gap-px overflow-hidden rounded-[var(--radius)] border border-border/70 sm:grid-cols-4">
                {hero.stats.map((s, i) => (
                  <div key={`${s.label}-${i}`} className="glass px-3 py-4">
                    <div className="font-display text-xl font-semibold text-accent">
                      {s.value}
                    </div>
                    <div className="mt-0.5 text-[0.7rem] leading-tight text-muted">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </Container>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <Link
          href="#explore"
          className="pointer-events-auto inline-flex h-9 w-9 animate-bounce items-center justify-center rounded-full border border-border bg-surface/70 text-accent backdrop-blur-sm"
          aria-label="Scroll to content"
        >
          <ChevronDown className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
