"use client";

import { useEditMode, useVE } from "./EditProvider";

/**
 * Wraps a section so that, in edit mode, hovering shows an outline and a pencil
 * button that deep-links to that section's editor in the admin.
 *
 * The wrapper element is always present but uses `display:contents` for normal
 * visitors, so it adds no layout box and never restructures the DOM when edit
 * mode toggles (important for sections with canvases / animations inside).
 */
export function Editable({
  href,
  label,
  children,
  className = "",
}: {
  /** Admin editor URL, e.g. /admin/globals/home-hero */
  href: string;
  /** Friendly name shown on the pencil button, e.g. "Hero" */
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const edit = useEditMode();
  const ve = useVE().active;
  // Inside the Visual Editor preview the pencil UI is suppressed.
  const showPencil = edit && !ve;
  return (
    <div
      className={showPencil ? `group/edit relative ${className}` : ""}
      style={showPencil ? undefined : { display: "contents" }}
    >
      {showPencil && (
        <>
          <div className="pointer-events-none absolute inset-0 z-30 rounded-[var(--radius-lg)] ring-2 ring-accent/0 transition-[box-shadow] duration-200 group-hover/edit:ring-accent/70" />
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="absolute right-3 top-3 z-40 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-contrast opacity-0 shadow-lg transition-opacity duration-200 group-hover/edit:opacity-100 focus-visible:opacity-100"
          >
            <span aria-hidden>✏️</span> Edit {label}
          </a>
        </>
      )}
      {children}
    </div>
  );
}
