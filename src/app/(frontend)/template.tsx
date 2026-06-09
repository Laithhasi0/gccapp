"use client";

import { motion } from "framer-motion";

/**
 * Per-route enter transition. Opacity only (no transform) so it never creates a
 * containing block that would break the sticky scroll sections.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
