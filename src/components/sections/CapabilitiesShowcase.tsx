"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

type Cap = {
  image: string;
  eyebrow: string;
  title: string;
  text: string;
  href: string;
};

function Capability({ cap, index, total }: { cap: Cap; index: number; total: number }) {
  return (
    <Container className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-14">
      <div className="order-2 lg:order-1">
        <span className="font-mono text-sm text-accent">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <div className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted">
          {cap.eyebrow}
        </div>
        <h3 className="mt-2 text-4xl sm:text-5xl">
          <span className="text-gradient">{cap.title}</span>
        </h3>
        <p className="mt-5 max-w-md text-lg">{cap.text}</p>
        <Link
          href={cap.href}
          className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          Explore the service
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="order-1 lg:order-2">
        <div className="ring-gradient relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-lg">
          <Image
            src={cap.image}
            alt={cap.title}
            fill
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="animate-kenburns object-cover"
            priority={index === 0}
          />
        </div>
      </div>
    </Container>
  );
}

export function CapabilitiesShowcase({
  eyebrow = "What we do",
  items,
}: {
  eyebrow?: string;
  items: Cap[];
}) {
  const caps = items;
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const barScaleX = useTransform(scrollYProgress, [0, 1], [1 / caps.length, 1]);

  // Derive the active panel from scroll — only one panel is ever rendered.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(caps.length - 1, Math.max(0, Math.floor(v * caps.length)));
    setActive(idx);
  });

  // Reduced motion → simple stacked sections.
  if (reduce) {
    return (
      <section id="explore" className="bg-surface py-16 sm:py-20">
        <Container>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </span>
          <h2 className="mt-2">Everything you need, end to end</h2>
        </Container>
        <div className="mt-12 space-y-16">
          {caps.map((c, i) => (
            <Capability key={c.title} cap={c} index={i} total={caps.length} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="explore"
      ref={section}
      className="relative"
      style={{ height: `${caps.length * 90}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden border-y border-border bg-gradient-to-b from-background via-surface to-background">
        <Container className="pointer-events-none absolute inset-x-0 top-20 z-10">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </span>
        </Container>

        <div className="relative h-[clamp(28rem,70vh,40rem)]">
          <AnimatePresence>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex items-center"
            >
              <Capability cap={caps[active]} index={active} total={caps.length} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step dots + progress bar */}
        <Container className="absolute inset-x-0 bottom-14">
          <div className="mb-4 flex items-center gap-2">
            {caps.map((c, i) => (
              <span
                key={c.title}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-8 bg-accent" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-border">
            <motion.div
              style={{ scaleX: barScaleX }}
              className="h-full origin-left rounded-full bg-gradient-to-r from-accent to-accent-hover"
            />
          </div>
        </Container>
      </div>
    </section>
  );
}
