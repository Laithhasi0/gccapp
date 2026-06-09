"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** Splits "150+" → { prefix:"", num:150, suffix:"+" }; "24/7" → no num. */
function parse(value: string): { prefix: string; num: number | null; suffix: string } {
  const m = value.match(/^(\D*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!m) return { prefix: value, num: null, suffix: "" };
  return { prefix: m[1], num: Number(m[2].replace(/,/g, "")), suffix: m[3] };
}

/** Count-up number that animates once when scrolled into view. */
export function StatCounter({ stat }: { stat: { value: string; label: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const { prefix, num, suffix } = parse(stat.value);
  const [value, setValue] = useState(0);
  const reduce = useReducedMotion();
  const display = num === null ? null : reduce ? num : value;

  useEffect(() => {
    if (reduce || num === null) return;
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
          setValue(Math.round(eased * num));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [num, reduce]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl font-semibold text-accent sm:text-5xl">
        {display === null ? stat.value : `${prefix}${display}${suffix}`}
      </div>
      <div className="mt-2 text-sm text-muted">{stat.label}</div>
    </div>
  );
}
