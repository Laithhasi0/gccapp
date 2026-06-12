"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import type { MediaRef } from "@/lib/homeBlocks";

type MediaDoc = {
  id: number | string;
  url?: string;
  alt?: string;
  sizes?: Record<string, { url?: string | null } | undefined>;
};

/**
 * Image picker modal: browse the media library or upload a new image.
 * Talks to Payload's REST API directly (same-origin admin cookie auth).
 */
export function MediaPicker({
  onSelect,
  onClose,
}: {
  onSelect: (media: MediaRef) => void;
  onClose: () => void;
}) {
  const [docs, setDocs] = useState<MediaDoc[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/media?limit=100&sort=-createdAt&depth=0");
        if (!res.ok) throw new Error();
        const data = (await res.json()) as { docs: MediaDoc[] };
        if (!cancelled) setDocs(data.docs);
      } catch {
        if (!cancelled) setError("Could not load the media library.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const pick = (d: MediaDoc) => {
    onSelect({ id: d.id, url: d.sizes?.card?.url || d.url });
  };

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("_payload", JSON.stringify({ alt: file.name.replace(/\.[a-z0-9]+$/i, "") }));
      const res = await fetch("/api/media", { method: "POST", body: form });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { doc: MediaDoc };
      pick(data.doc);
    } catch {
      setError("Upload failed. Try a different image.");
      setUploading(false);
    }
  };

  const thumb = (d: MediaDoc) => d.sizes?.thumbnail?.url || d.sizes?.card?.url || d.url;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
          <div className="flex-1 text-sm font-semibold text-zinc-100">Choose an image</div>
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-cyan-950 transition-colors hover:bg-cyan-300 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            Upload new
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
            }}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {error && (
            <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </div>
          )}
          {docs == null && !error ? (
            <div className="flex h-40 items-center justify-center text-sm text-zinc-500">
              <Loader2 className="me-2 h-4 w-4 animate-spin" /> Loading media…
            </div>
          ) : docs && docs.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-zinc-500">
              No images yet — upload your first one.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {docs?.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => pick(d)}
                  title={d.alt}
                  className="group overflow-hidden rounded-lg border border-zinc-800 transition-colors hover:border-cyan-400"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb(d)} alt={d.alt ?? ""} className="aspect-square w-full object-cover" />
                  <span className="block truncate bg-zinc-800 px-1.5 py-1 text-[10px] text-zinc-400 group-hover:text-zinc-200">
                    {d.alt || "image"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
