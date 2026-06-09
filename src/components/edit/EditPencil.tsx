"use client";

import { useEditMode } from "./EditProvider";

/**
 * Standalone pencil button for components that already manage their own
 * positioning (e.g. GSAP-pinned sections) and shouldn't be wrapped in an extra
 * div. Place inside a `relative` container. Renders nothing for normal visitors.
 */
export function EditPencil({
  href,
  label,
  className = "right-4 top-4",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const edit = useEditMode();
  if (!edit) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{ zIndex: 50 }}
      className={`absolute inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-contrast shadow-lg hover:bg-accent-hover ${className}`}
    >
      <span aria-hidden>✏️</span> Edit {label}
    </a>
  );
}
