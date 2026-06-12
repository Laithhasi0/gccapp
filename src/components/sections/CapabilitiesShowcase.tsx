"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";
import { useEditMode, useEditReady } from "@/components/edit/EditProvider";
import { EditableText } from "@/components/edit/EditableText";
import { useI18n } from "@/components/i18n/LocaleProvider";

type Cap = {
  image: string;
  eyebrow: string;
  title: string;
  text: string;
  href: string;
};

function Capability({
  cap,
  index,
  total,
  editPath,
}: {
  cap: Cap;
  index: number;
  total: number;
  editPath?: string;
}) {
  const { t } = useI18n();
  const text = (field: string, value: string) =>
    editPath ? <EditableText path={`${editPath}.items.${index}.${field}`} value={value} /> : value;
  return (
    <Container className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-14">
      <div className="order-2 lg:order-1">
        <span className="font-mono text-sm text-accent">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <div className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted">
          {text("eyebrow", cap.eyebrow)}
        </div>
        <h3 className="mt-2 text-4xl sm:text-5xl">
          <span className="text-gradient">{text("title", cap.title)}</span>
        </h3>
        <p className="mt-5 max-w-md text-lg">{text("text", cap.text)}</p>
        <Link
          href={cap.href}
          className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          {t.buttons.exploreService}
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

/**
 * "What we do" showcase. The section pins to the viewport and steps through each
 * capability as you scroll, driven by GSAP ScrollTrigger (wired to Lenis smooth
 * scroll in SmoothScroll.tsx). The active panel cross-fades; a progress bar is
 * updated imperatively via a ref to avoid a React re-render on every frame. On
 * reduced-motion it degrades to a simple stacked list.
 */
export function CapabilitiesShowcase({
  eyebrow = "What we do",
  items,
  editPath,
}: {
  eyebrow?: string;
  items: Cap[];
  editPath?: string;
}) {
  const { t } = useI18n();
  const caps = items;
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const edit = useEditMode();
  const ready = useEditReady();
  // In edit mode, render the static (un-pinned) layout so click-to-edit
  // overlays don't fight GSAP's DOM manipulation.
  const reduce = useReducedMotion() || edit;
  const [active, setActive] = useState(0);

  useEffect(() => {
    // Wait until edit mode is resolved so GSAP never inits then tears down.
    if (!ready || reduce) return;
    const sectionEl = section.current;
    if (!sectionEl || caps.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionEl,
        start: "top top",
        end: () => `+=${caps.length * window.innerHeight}`,
        pin: pin.current,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const idx = Math.min(
            caps.length - 1,
            Math.floor(self.progress * caps.length),
          );
          setActive((prev) => (prev === idx ? prev : idx));
          if (bar.current) {
            bar.current.style.transform = `scaleX(${Math.max(0.04, self.progress)})`;
          }
        },
      });
    }, section);

    const t = window.setTimeout(() => ScrollTrigger.refresh(), 600);

    return () => {
      window.clearTimeout(t);
      ctx.revert();
    };
  }, [ready, reduce, caps.length]);

  // Reduced motion / edit mode → simple stacked sections, always fully visible.
  if (reduce) {
    return (
      <section id="explore" className="relative bg-surface py-16 sm:py-20">
        <Container>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            {editPath ? <EditableText path={`${editPath}.eyebrow`} value={eyebrow} /> : eyebrow}
          </span>
          <h2 className="mt-2">{t.caps.headingFull}</h2>
        </Container>
        <div className="mt-12 space-y-16">
          {caps.map((c, i) => (
            <Capability key={`${c.title}-${i}`} cap={c} index={i} total={caps.length} editPath={editPath} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="explore" ref={section} className="relative">
      <div
        ref={pin}
        className="flex h-screen flex-col justify-center overflow-hidden border-y border-border bg-gradient-to-b from-background via-surface to-background"
      >
        <Container className="pointer-events-none absolute inset-x-0 top-20 z-10">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </span>
        </Container>

        <div className="relative h-[clamp(28rem,70vh,40rem)]">
          <AnimatePresence initial={false}>
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
            <div
              ref={bar}
              className="h-full origin-left rounded-full bg-gradient-to-r from-accent to-accent-hover"
              style={{ transform: "scaleX(0.04)" }}
            />
          </div>
        </Container>
      </div>
    </section>
  );
}
