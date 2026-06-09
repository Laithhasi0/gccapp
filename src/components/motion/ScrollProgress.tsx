"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin cyan progress bar at the very top, tied to page scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-accent to-accent-hover"
      aria-hidden="true"
    />
  );
}
