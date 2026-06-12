"use client";

import { ExternalLink, Plus } from "lucide-react";
import type { EditorPage } from "./pages";

/**
 * Left panel for non-home pages: explains what's on the page and offers
 * one-click shortcuts to each content source's editor. The preview itself is
 * also clickable — every block shows an "✏️ Edit" chip on hover.
 */
export function PageInfoPanel({ page }: { page: EditorPage }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-800 px-4 py-3">
        <div className="text-sm font-semibold text-zinc-100">
          {page.icon} {page.label} page
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
          Hover anything in the preview and click <span className="font-semibold text-cyan-300">✏️ Edit</span> to
          open its editor. Every text field there has separate Arabic and English versions.
        </p>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {page.sources.map((s) => (
          <div key={s.title} className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-base">
                {s.icon}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-zinc-100">{s.title}</div>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{s.desc}</p>
              </div>
            </div>
            <div className="mt-2.5 flex gap-2">
              <button
                type="button"
                onClick={() => window.open(s.href, "_blank")}
                className="flex items-center gap-1.5 rounded-md bg-cyan-400 px-2.5 py-1.5 text-xs font-semibold text-cyan-950 transition-colors hover:bg-cyan-300"
              >
                <ExternalLink className="h-3 w-3" /> Edit
              </button>
              {s.addHref && (
                <button
                  type="button"
                  onClick={() => window.open(s.addHref, "_blank")}
                  className="flex items-center gap-1.5 rounded-md border border-zinc-700 px-2.5 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:border-cyan-400/60 hover:text-cyan-300"
                >
                  <Plus className="h-3 w-3" /> Add new
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
