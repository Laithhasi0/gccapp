/**
 * Per-route enter transition. Uses a pure CSS animation (not JS-driven opacity)
 * so page content is never left invisible if client-side hydration is delayed or
 * an iframe/embedding context throttles JS animations. Opacity only (no
 * transform) so it never creates a containing block that would break the sticky
 * scroll sections. Reduced motion is honored globally via globals.css.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
