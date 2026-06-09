"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in seconds. */
  delay?: number;
  /** Travel distance in px. */
  y?: number;
};

/**
 * Gentle fade-up on scroll into view, using a native IntersectionObserver
 * (reliable across browsers and smooth-scroll setups). Reduced motion is honored
 * globally via the `prefers-reduced-motion` rule in globals.css (which neutralizes
 * the transition), so no JS media query is read here — that keeps the server and
 * client render identical and avoids hydration mismatches.
 */
export function Reveal({ children, className, delay = 0, y = 20 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const supported = typeof IntersectionObserver !== "undefined";

    // Safety net: never leave content invisible if the observer can't fire
    // (unsupported, or environments where IO callbacks don't run).
    const fallback = setTimeout(() => setShown(true), supported ? 1200 : 0);

    let io: IntersectionObserver | undefined;
    if (supported) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setShown(true);
            clearTimeout(fallback);
            io?.disconnect();
          }
        },
        { rootMargin: "0px 0px -80px 0px", threshold: 0.01 },
      );
      io.observe(el);
    }

    return () => {
      clearTimeout(fallback);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: `opacity 0.65s var(--ease) ${delay}s, transform 0.65s var(--ease) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
