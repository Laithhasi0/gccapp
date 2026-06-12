"use client";

import { useState } from "react";
import { Copy, Eye, EyeOff, GripVertical, Plus, Trash2 } from "lucide-react";
import { blockIcon, blockLabel, type HomeSection } from "@/lib/homeBlocks";

/**
 * Left panel, list view — every section on the page in order.
 * Click to select & edit, drag to reorder, quick actions on hover.
 */
export function SectionListPanel({
  sections,
  selected,
  onSelect,
  onAdd,
  onAction,
  onReorder,
}: {
  sections: HomeSection[];
  selected: number | null;
  onSelect: (index: number) => void;
  onAdd: () => void;
  onAction: (index: number, action: string) => void;
  onReorder: (from: number, to: number) => void;
}) {
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dropAt, setDropAt] = useState<number | null>(null);

  const snippet = (s: HomeSection) => {
    const v = s.title ?? s.headline ?? "";
    return typeof v === "string" ? v : "";
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-800 px-4 py-3">
        <div className="text-sm font-semibold text-zinc-100">Page sections</div>
        <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
          Click a section to edit it, or click anything in the preview. Drag to reorder.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {sections.map((s, i) => (
          <div
            key={s.id ?? `${s.type}-${i}`}
            draggable
            onDragStart={(e) => {
              setDragFrom(i);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={() => {
              setDragFrom(null);
              setDropAt(null);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragFrom != null && i !== dropAt) setDropAt(i);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragFrom != null) onReorder(dragFrom, i);
              setDragFrom(null);
              setDropAt(null);
            }}
            onClick={() => onSelect(i)}
            className={`group mb-1 flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-2.5 transition-colors ${
              selected === i
                ? "border-cyan-400/60 bg-cyan-400/10"
                : dropAt === i && dragFrom !== i
                  ? "border-cyan-400/40 bg-zinc-800/80"
                  : "border-transparent hover:bg-zinc-800/70"
            } ${s.hidden ? "opacity-50" : ""}`}
          >
            <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-zinc-600 group-hover:text-zinc-400" />
            <span className="text-base leading-none" aria-hidden>
              {blockIcon(s.type)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-zinc-200">{blockLabel(s.type)}</div>
              {snippet(s) && <div className="truncate text-xs text-zinc-500">{snippet(s)}</div>}
            </div>
            <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              <IconButton
                title={s.hidden ? "Show" : "Hide"}
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(i, "hide");
                }}
              >
                {s.hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </IconButton>
              <IconButton
                title="Duplicate"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(i, "duplicate");
                }}
              >
                <Copy className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton
                title="Delete"
                danger
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(i, "delete");
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </IconButton>
            </div>
            {s.hidden && <span className="text-[10px] font-semibold uppercase text-zinc-500">hidden</span>}
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-800 p-3">
        <button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-3 py-2.5 text-sm font-semibold text-cyan-950 transition-colors hover:bg-cyan-300"
        >
          <Plus className="h-4 w-4" /> Add section
        </button>
      </div>
    </div>
  );
}

function IconButton({
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
      className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors ${
        danger ? "text-zinc-400 hover:bg-red-500/20 hover:text-red-400" : "text-zinc-400 hover:bg-zinc-700 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
