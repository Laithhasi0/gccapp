"use client";

import { useEffect } from "react";
import { useLivePreview } from "@payloadcms/live-preview-react";
import type { AppearanceData } from "@/lib/cms";

/**
 * Applies the Appearance global's colours/theme live inside the Payload preview
 * iframe (no save needed). A no-op for normal visitors.
 */
export function LiveAppearance({ initialData }: { initialData: AppearanceData }) {
  const { data } = useLivePreview<AppearanceData>({
    initialData,
    serverURL: typeof window !== "undefined" ? window.location.origin : "",
    depth: 0,
  });

  useEffect(() => {
    const d = data as Record<string, unknown>;
    // Only act when the edited document is actually the appearance global.
    if (!("accentColor" in d) && !("theme" in d)) return;
    const root = document.documentElement;
    if (data.accentColor) root.style.setProperty("--accent", data.accentColor);
    if (data.accentHover) root.style.setProperty("--accent-hover", data.accentHover);
    if (data.backgroundColor) root.style.setProperty("--background", data.backgroundColor);
    if (data.theme) root.classList.toggle("dark", data.theme !== "light");
  }, [data]);

  return null;
}
