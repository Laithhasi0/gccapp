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
 * Gentle fade-up entrance, implemented as a pure CSS animation (no JS-driven
 * opacity). Using `animation-fill-mode: both` guarantees the element settles at
 * `opacity: 1` even if client-side JavaScript never runs, is throttled, or the
 * page is embedded in an iframe where rAF/IntersectionObserver callbacks behave
 * differently. Content is therefore NEVER left permanently invisible.
 *
 * Reduced motion is honored globally via the `prefers-reduced-motion` rule in
 * globals.css, which collapses the animation duration so content appears
 * instantly. No hooks are used, so this renders identically on server and client
 * and adds nothing to the client JS bundle.
 */
export function Reveal({ children, className, delay = 0, y = 20 }: RevealProps) {
  return (
    <div
      className={cn("reveal", className)}
      style={
        {
          "--reveal-delay": `${delay}s`,
          "--reveal-y": `${y}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
