"use client";

import { ChevronLeft } from "lucide-react";
import { BLOCKS } from "@/lib/homeBlocks";

/** Left panel, "Add section" view — a gallery of all section types. */
export function AddSectionPanel({
  onAdd,
  onBack,
}: {
  onAdd: (type: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div>
          <div className="text-sm font-semibold text-zinc-100">Add a section</div>
          <p className="text-xs text-zinc-500">It will be placed after the selected section.</p>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {BLOCKS.map((b) => (
          <button
            key={b.type}
            type="button"
            onClick={() => onAdd(b.type)}
            className="mb-1.5 flex w-full items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-3 text-start transition-colors hover:border-cyan-400/50 hover:bg-zinc-800"
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-base">
              {b.icon}
            </span>
            <span>
              <span className="block text-sm font-semibold text-zinc-100">{b.label}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-zinc-500">{b.description}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
