"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { Stat } from "@/content/types";

/** Count-up number that animates once when scrolled into view. */
export function StatCounter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  const reduce = useReducedMotion();
  const display = reduce ? stat.value : value;

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        const duration = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(eased * stat.value));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stat.value, reduce]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl font-semibold text-accent sm:text-5xl">
        {stat.prefix}
        {display}
        {stat.suffix}
      </div>
      <div className="mt-2 text-sm text-muted">{stat.label}</div>
    </div>
  );
}
