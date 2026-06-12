"use client";

import { useState } from "react";

const ACCENT = "#25c9e2";

/**
 * Dashboard button: imports the website's built-in content (Arabic + English
 * + images) into the CMS collections. Safe to click any time — collections
 * that already have content are skipped.
 */
export function SeedButton() {
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [report, setReport] = useState<Record<string, string> | null>(null);

  const run = async () => {
    setState("running");
    try {
      const res = await fetch("/api/editor/seed", { method: "POST" });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { report: Record<string, string> };
      setReport(data.report);
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={run}
        disabled={state === "running"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "0.45rem 0.85rem",
          borderRadius: 8,
          fontSize: "0.8rem",
          fontWeight: 600,
          background: ACCENT,
          color: "#06222a",
          border: "1px solid transparent",
          cursor: state === "running" ? "wait" : "pointer",
          opacity: state === "running" ? 0.7 : 1,
          lineHeight: 1,
        }}
      >
        {state === "running" ? "⏳ Importing…" : state === "done" ? "✅ Done — import again" : "⬇️ Import website content"}
      </button>
      {state === "error" && (
        <div style={{ marginTop: 8, fontSize: "0.75rem", color: "#e5484d" }}>
          Import failed — check the server logs and try again.
        </div>
      )}
      {report && (
        <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none", fontSize: "0.75rem", color: "var(--theme-elevation-600)" }}>
          {Object.entries(report).map(([k, v]) => (
            <li key={k}>
              <strong>{k}</strong>: {v}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
