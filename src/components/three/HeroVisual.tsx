"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

function Fallback() {
  return (
    <Image
      src="/media/images/scene-3d-fallback.webp"
      alt=""
      fill
      sizes="(max-width: 768px) 90vw, 600px"
      className="object-contain"
      priority
      aria-hidden="true"
    />
  );
}

const HeroObject = dynamic(() => import("./HeroObject"), {
  ssr: false,
  loading: () => <Fallback />,
});

/**
 * Contained hero 3D object — auto-rotating, NOT scroll-coupled (so it can't
 * cause scroll jank). Code-split, paused when the tab is hidden, and replaced
 * with a static frame on mobile / reduced-motion.
 */
export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"loading" | "full" | "static">("loading");
  const [hidden, setHidden] = useState(false);
  const [offscreen, setOffscreen] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 768px)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(reduce || small ? "static" : "full");

    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);

    // Pause the render loop once the hero scrolls out of view (saves the GPU).
    let io: IntersectionObserver | undefined;
    if (ref.current && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([e]) => setOffscreen(!e.isIntersecting),
        { rootMargin: "120px" },
      );
      io.observe(ref.current);
    }

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {mode === "full" ? <HeroObject paused={hidden || offscreen} /> : <Fallback />}
    </div>
  );
}
