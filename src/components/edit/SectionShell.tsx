"use client";

import Link from "next/link";
import { ArrowDown, ArrowUp, Copy, EyeOff, Settings2, Trash2 } from "lucide-react";
import { useEditMode, useVE, vePost } from "./EditProvider";

/**
 * Wraps every home-page section rendered by HomeRenderer.
 *
 * Visitors: a transparent `display:contents` wrapper — zero layout impact.
 * Pencil mode (?edit=1): a pencil linking to the Visual Editor.
 * Visual Editor mode: hover outline + name chip; click selects the section in
 * the editor sidebar; when selected, a floating toolbar offers move / hide /
 * duplicate / delete — all executed by the parent editor window.
 */
export function SectionShell({
  index,
  label,
  icon,
  children,
}: {
  index: number;
  label: string;
  icon: string;
  children: React.ReactNode;
}) {
  const edit = useEditMode();
  const { active, selected } = useVE();

  if (!active) {
    if (!edit) return <div style={{ display: "contents" }}>{children}</div>;
    return (
      <div className="group/edit relative">
        <div className="pointer-events-none absolute inset-0 z-30 ring-2 ring-accent/0 transition-[box-shadow] duration-200 group-hover/edit:ring-accent/70" />
        <Link
          href="/editor"
          className="absolute end-3 top-3 z-40 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-contrast opacity-0 shadow-lg transition-opacity duration-200 group-hover/edit:opacity-100 focus-visible:opacity-100"
        >
          <span aria-hidden>✏️</span> Edit {label}
        </Link>
        {children}
      </div>
    );
  }

  const isSelected = selected === index;
  const action = (a: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    vePost({ type: "section-action", index, action: a });
  };

  return (
    <div
      data-ve-index={index}
      className="group/ve relative"
      onClick={() => vePost({ type: "select-section", index })}
    >
      {/* Outline */}
      <div
        className={`pointer-events-none absolute inset-0 z-[60] transition-[box-shadow] duration-150 ${
          isSelected
            ? "shadow-[inset_0_0_0_2px_var(--accent)]"
            : "group-hover/ve:shadow-[inset_0_0_0_2px_color-mix(in_srgb,var(--accent)_55%,transparent)]"
        }`}
      />
      {/* Name chip */}
      <div
        className={`pointer-events-none absolute start-3 top-3 z-[61] flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-contrast shadow-lg transition-opacity duration-150 ${
          isSelected ? "opacity-100" : "opacity-0 group-hover/ve:opacity-100"
        }`}
      >
        <span aria-hidden>{icon}</span> {label}
      </div>
      {/* Floating toolbar (selected only) */}
      {isSelected && (
        <div className="absolute end-3 top-3 z-[62] flex items-center gap-1 rounded-full border border-border bg-background/95 p-1 shadow-xl backdrop-blur">
          <ToolButton title="Edit settings" onClick={action("settings")}>
            <Settings2 className="h-3.5 w-3.5" />
          </ToolButton>
          <ToolButton title="Move up" onClick={action("up")}>
            <ArrowUp className="h-3.5 w-3.5" />
          </ToolButton>
          <ToolButton title="Move down" onClick={action("down")}>
            <ArrowDown className="h-3.5 w-3.5" />
          </ToolButton>
          <ToolButton title="Duplicate" onClick={action("duplicate")}>
            <Copy className="h-3.5 w-3.5" />
          </ToolButton>
          <ToolButton title="Hide" onClick={action("hide")}>
            <EyeOff className="h-3.5 w-3.5" />
          </ToolButton>
          <ToolButton title="Delete" onClick={action("delete")} danger>
            <Trash2 className="h-3.5 w-3.5" />
          </ToolButton>
        </div>
      )}
      {children}
    </div>
  );
}

function ToolButton({
  title,
  onClick,
  danger,
  children,
}: {
  title: string;
  onClick: (e: React.MouseEvent) => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
        danger ? "text-red-400 hover:bg-red-500/15" : "text-ink hover:bg-accent-soft hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}
