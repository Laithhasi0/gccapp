"use client";

import { useEditMode, useVE, vePost } from "./EditProvider";

/**
 * Compact per-item edit chip shown on cards (a project, a service, a team
 * member, one FAQ…) while editing. Clicking opens that exact document's
 * editor in the admin. Rendered as a span so it can live safely inside links.
 * Invisible to normal visitors.
 */
export function ItemPencil({
  collection,
  id,
  label,
  className = "start-2 top-2",
}: {
  /** Payload collection slug, e.g. "projects". */
  collection: string;
  /** Document id — falls back to the collection list when missing. */
  id?: number | string;
  label: string;
  className?: string;
}) {
  const edit = useEditMode();
  const ve = useVE().active;
  if (!edit && !ve) return null;
  const href = id != null ? `/admin/collections/${collection}/${id}` : `/admin/collections/${collection}`;
  const open = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (ve) vePost({ type: "open-admin", href, label });
    else window.open(href, "_blank", "noopener");
  };
  return (
    <span
      role="button"
      tabIndex={0}
      title={`Edit ${label}`}
      aria-label={`Edit ${label}`}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") open(e);
      }}
      className={`absolute z-40 inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-accent text-xs text-accent-contrast shadow-lg ring-2 ring-background/70 transition-transform duration-150 hover:scale-110 ${className}`}
    >
      <span aria-hidden>✏️</span>
    </span>
  );
}
