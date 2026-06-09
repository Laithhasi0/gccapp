"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Scene3DFallback } from "./Scene3DFallback";

/**
 * Persistent, fixed full-viewport host for the scroll-driven 3D scene.
 * Mounted ONCE (in the root layout), sits behind all content, never captures
 * pointer events. The heavy Three.js bundle is code-split via next/dynamic and
 * is NOT part of the initial JS.
 */

const Scene3D = dynamic(() => import("./Scene3D"), {
  ssr: false,
  loading: () => <Scene3DFallback />,
});

type Mode = "loading" | "full" | "simplified" | "static";

function detectMode(): Mode {
  if (typeof window === "undefined") return "loading";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return "static";

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.matchMedia("(max-width: 768px)").matches;
  const lowCores =
    typeof navigator !== "undefined" &&
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency <= 4;
  const lowMemory =
    typeof navigator !== "undefined" &&
    // deviceMemory is non-standard but widely supported on Chrome/Android
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined &&
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 4;

  // Phones / very low-power devices get the static fallback (no WebGL cost).
  if (small && coarse) return "static";
  // Tablets / modest hardware get a simplified scene.
  if (coarse || lowCores || lowMemory) return "simplified";
  return "full";
}

export function Scene3DRoot() {
  const [mode, setMode] = useState<Mode>("loading");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // One-time, client-only capability decision on mount. First paint renders the
    // static fallback (SSR-safe), then we upgrade. This is a legitimate mount-time
    // sync, not a cascading render, so the immutability/cascade rule is suppressed.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(detectMode());

    // Pause rendering when the tab is hidden (saves battery / GPU).
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    // Re-evaluate on resize (e.g. desktop ↔ responsive breakpoints).
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = () => setMode(detectMode());
    mq.addEventListener("change", onChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      data-scene-mode={mode}
    >
      {mode === "static" || mode === "loading" ? (
        <Scene3DFallback />
      ) : (
        <Scene3D paused={paused} simplified={mode === "simplified"} />
      )}
    </div>
  );
}
