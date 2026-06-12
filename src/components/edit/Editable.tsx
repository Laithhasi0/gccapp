"use client";

import { useEditMode, useVE, vePost } from "./EditProvider";

/**
 * Wraps a content block so it is editable from the admin:
 *
 * - Pencil mode (?edit=1): hovering shows an outline and a pencil that
 *   deep-links to the block's editor in the admin (new tab).
 * - Visual Editor preview: the same hover outline, but the button asks the
 *   parent editor window to open the admin editor (via postMessage), so the
 *   preview itself never navigates away.
 * - Normal visitors: a `display:contents` wrapper — zero layout impact.
 */
export function Editable({
  href,
  label,
  children,
  className = "",
}: {
  /** Admin editor URL, e.g. /admin/collections/services */
  href: string;
  /** Friendly name shown on the button, e.g. "Services" */
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const edit = useEditMode();
  const ve = useVE().active;
  const active = edit || ve;

  if (!active) {
    return <div style={{ display: "contents" }}>{children}</div>;
  }

  const chipClasses =
    "absolute end-3 top-3 z-40 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-contrast opacity-0 shadow-lg transition-opacity duration-200 hover:bg-accent-hover group-hover/edit:opacity-100 focus-visible:opacity-100";

  return (
    <div className={`group/edit relative ${className}`}>
      <div className="pointer-events-none absolute inset-0 z-30 rounded-[var(--radius-lg)] ring-2 ring-accent/0 transition-[box-shadow] duration-200 group-hover/edit:ring-accent/70" />
      {ve ? (
        <button
          type="button"
          onClick={() => vePost({ type: "open-admin", href, label })}
          className={chipClasses}
        >
          <span aria-hidden>✏️</span> Edit {label}
        </button>
      ) : (
        <a href={href} target="_blank" rel="noreferrer" className={chipClasses}>
          <span aria-hidden>✏️</span> Edit {label}
        </a>
      )}
      {children}
    </div>
  );
}
