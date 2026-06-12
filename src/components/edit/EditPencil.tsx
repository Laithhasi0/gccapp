"use client";

import { useEditMode, useVE, vePost } from "./EditProvider";

/**
 * Standalone pencil button for components that already manage their own
 * positioning (e.g. GSAP-pinned sections) and shouldn't be wrapped in an extra
 * div. Place inside a `relative` container. Renders nothing for normal
 * visitors. In the Visual Editor preview it asks the parent editor window to
 * open the admin editor instead of navigating.
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
  const ve = useVE().active;
  if (!edit && !ve) return null;
  const classes = `absolute inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-contrast shadow-lg hover:bg-accent-hover ${className}`;
  if (ve) {
    return (
      <button
        type="button"
        style={{ zIndex: 50 }}
        onClick={() => vePost({ type: "open-admin", href, label })}
        className={classes}
      >
        <span aria-hidden>✏️</span> Edit {label}
      </button>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{ zIndex: 50 }} className={classes}>
      <span aria-hidden>✏️</span> Edit {label}
    </a>
  );
}
