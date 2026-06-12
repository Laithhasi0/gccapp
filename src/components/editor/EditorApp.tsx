"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CloudUpload,
  ExternalLink,
  Monitor,
  RefreshCw,
  Redo2,
  Smartphone,
  Tablet,
  TriangleAlert,
  Undo2,
} from "lucide-react";
import { blockDef, type HomeSection } from "@/lib/homeBlocks";
import { isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { getDeep, newRowId, setDeep } from "./deep";
import { SectionListPanel } from "./SectionListPanel";
import { SettingsPanel } from "./SettingsPanel";
import { AddSectionPanel } from "./AddSectionPanel";

const VE_NS = "gcc-ve";

type Status = "loading" | "saved" | "saving" | "error";
type Device = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTH: Record<Device, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

/** Strips section ids (so Payload assigns fresh ones) on duplicated rows. */
function withFreshIds(section: HomeSection): HomeSection {
  const strip = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(strip);
    if (v && typeof v === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        if (k === "id") continue;
        out[k] = strip(val);
      }
      return out;
    }
    return v;
  };
  return { ...(strip(section) as HomeSection), id: newRowId() };
}

export function EditorApp() {
  const [sections, _setSections] = useState<HomeSection[] | null>(null);
  const [locale, setLocale] = useState<Locale>("ar");
  const [selected, setSelected] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [device, setDevice] = useState<Device>("desktop");
  const [status, setStatus] = useState<Status>("loading");
  const [iframeKey, setIframeKey] = useState(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sectionsRef = useRef<HomeSection[] | null>(null);
  const selectedRef = useRef<number | null>(null);
  const localeRef = useRef<Locale>("ar");
  const historyRef = useRef<{ past: HomeSection[][]; future: HomeSection[][] }>({ past: [], future: [] });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRefresh = useRef(false);
  const dirtyRef = useRef(false);
  const savingRef = useRef(false);
  const coalesceRef = useRef<{ key: string; at: number } | null>(null);

  const setSections = useCallback((next: HomeSection[] | null) => {
    sectionsRef.current = next;
    _setSections(next);
  }, []);

  const syncHistoryFlags = useCallback(() => {
    setCanUndo(historyRef.current.past.length > 0);
    setCanRedo(historyRef.current.future.length > 0);
  }, []);

  const postToIframe = useCallback((msg: Record<string, unknown>) => {
    iframeRef.current?.contentWindow?.postMessage({ ns: VE_NS, ...msg }, window.location.origin);
  }, []);

  // Lets doSave re-trigger itself when edits arrive mid-save (avoids TDZ self-reference).
  const doSaveRef = useRef<() => Promise<void>>(async () => {});

  /* ------------------------------- load/save ------------------------------ */

  const load = useCallback(
    async (loc: Locale) => {
      setStatus("loading");
      try {
        const res = await fetch(`/api/editor/home?locale=${loc}`);
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        const data = (await res.json()) as { sections: HomeSection[] };
        setSections(data.sections);
        historyRef.current = { past: [], future: [] };
        dirtyRef.current = false;
        syncHistoryFlags();
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    },
    [setSections, syncHistoryFlags],
  );

  const doSave = useCallback(async () => {
    if (savingRef.current || !sectionsRef.current) return;
    savingRef.current = true;
    setStatus("saving");
    const snapshot = sectionsRef.current;
    const refresh = pendingRefresh.current;
    pendingRefresh.current = false;
    try {
      const res = await fetch("/api/editor/home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: snapshot, locale: localeRef.current }),
      });
      if (!res.ok) throw new Error(`save failed (${res.status})`);
      const data = (await res.json()) as { sections: HomeSection[] };
      savingRef.current = false;
      if (sectionsRef.current === snapshot) {
        // Adopt server-assigned row ids so future saves keep matching rows
        // (which is what preserves the other language's translations).
        setSections(data.sections);
        dirtyRef.current = false;
        setStatus("saved");
      } else {
        // Edits arrived while saving — go again.
        setStatus("saving");
        void doSaveRef.current();
      }
      if (refresh) postToIframe({ type: "refresh" });
    } catch {
      savingRef.current = false;
      pendingRefresh.current = pendingRefresh.current || refresh;
      setStatus("error");
    }
  }, [postToIframe, setSections]);

  useEffect(() => {
    doSaveRef.current = doSave;
  }, [doSave]);

  const scheduleSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void doSave(), 700);
  }, [doSave]);

  /**
   * Apply a change. `refresh` re-renders the preview after saving (anything
   * except inline typing, which already shows in the page). `coalesceKey`
   * merges rapid same-field edits into one undo step.
   */
  const commit = useCallback(
    (next: HomeSection[], opts: { refresh?: boolean; coalesceKey?: string } = {}) => {
      const { refresh = true, coalesceKey } = opts;
      const prev = sectionsRef.current;
      if (prev) {
        const now = Date.now();
        const last = coalesceRef.current;
        const coalesce = coalesceKey && last && last.key === coalesceKey && now - last.at < 1500;
        if (!coalesce) historyRef.current.past.push(prev);
        if (historyRef.current.past.length > 100) historyRef.current.past.shift();
        historyRef.current.future = [];
        coalesceRef.current = coalesceKey ? { key: coalesceKey, at: now } : null;
      }
      setSections(next);
      dirtyRef.current = true;
      if (refresh) pendingRefresh.current = true;
      syncHistoryFlags();
      scheduleSave();
    },
    [scheduleSave, setSections, syncHistoryFlags],
  );

  const undo = useCallback(() => {
    const { past, future } = historyRef.current;
    const prev = past.pop();
    if (!prev || !sectionsRef.current) return;
    future.push(sectionsRef.current);
    coalesceRef.current = null;
    setSections(prev);
    dirtyRef.current = true;
    pendingRefresh.current = true;
    syncHistoryFlags();
    scheduleSave();
  }, [scheduleSave, setSections, syncHistoryFlags]);

  const redo = useCallback(() => {
    const { past, future } = historyRef.current;
    const next = future.pop();
    if (!next || !sectionsRef.current) return;
    past.push(sectionsRef.current);
    coalesceRef.current = null;
    setSections(next);
    dirtyRef.current = true;
    pendingRefresh.current = true;
    syncHistoryFlags();
    scheduleSave();
  }, [scheduleSave, setSections, syncHistoryFlags]);

  /* ------------------------------- selection ------------------------------ */

  const selectSection = useCallback(
    (index: number | null, opts: { scroll?: boolean } = {}) => {
      setSelected(index);
      selectedRef.current = index;
      setAdding(false);
      postToIframe({ type: "select", index });
      if (index != null && opts.scroll !== false) postToIframe({ type: "scroll-to", index });
    },
    [postToIframe],
  );

  /* -------------------------------- actions ------------------------------- */

  const moveSection = useCallback(
    (index: number, dir: -1 | 1) => {
      const list = sectionsRef.current;
      if (!list) return;
      const to = index + dir;
      if (to < 0 || to >= list.length) return;
      const next = list.slice();
      const [row] = next.splice(index, 1);
      next.splice(to, 0, row);
      commit(next);
      selectSection(to, { scroll: false });
    },
    [commit, selectSection],
  );

  const reorderSection = useCallback(
    (from: number, to: number) => {
      const list = sectionsRef.current;
      if (!list || from === to) return;
      const next = list.slice();
      const [row] = next.splice(from, 1);
      next.splice(to, 0, row);
      commit(next);
      selectSection(to, { scroll: false });
    },
    [commit, selectSection],
  );

  const toggleHidden = useCallback(
    (index: number) => {
      const list = sectionsRef.current;
      if (!list) return;
      commit(setDeep(list, `${index}.hidden`, !list[index].hidden));
    },
    [commit],
  );

  const duplicateSection = useCallback(
    (index: number) => {
      const list = sectionsRef.current;
      if (!list) return;
      const next = list.slice();
      next.splice(index + 1, 0, withFreshIds(list[index]));
      commit(next);
      selectSection(index + 1, { scroll: false });
    },
    [commit, selectSection],
  );

  const removeSection = useCallback(
    (index: number) => {
      const list = sectionsRef.current;
      if (!list) return;
      const label = blockDef(list[index].type)?.label ?? list[index].type;
      if (!window.confirm(`Delete the "${label}" section? You can undo this.`)) return;
      commit(list.filter((_, i) => i !== index));
      selectSection(null);
    },
    [commit, selectSection],
  );

  const addSection = useCallback(
    (type: string) => {
      const list = sectionsRef.current;
      const def = blockDef(type);
      if (!list || !def) return;
      const fresh = { ...def.defaults(localeRef.current), id: newRowId() };
      const at = selectedRef.current != null ? selectedRef.current + 1 : list.length;
      const next = list.slice();
      next.splice(at, 0, fresh);
      commit(next);
      selectSection(at, { scroll: false });
    },
    [commit, selectSection],
  );

  const handleAction = useCallback(
    (index: number, action: string) => {
      if (action === "settings") selectSection(index, { scroll: false });
      else if (action === "up") moveSection(index, -1);
      else if (action === "down") moveSection(index, 1);
      else if (action === "hide") toggleHidden(index);
      else if (action === "duplicate") duplicateSection(index);
      else if (action === "delete") removeSection(index);
    },
    [duplicateSection, moveSection, removeSection, selectSection, toggleHidden],
  );

  /** Settings-panel / inline field edit. Path is relative to the section. */
  const handleField = useCallback(
    (index: number, path: string, value: unknown, opts: { refresh?: boolean } = {}) => {
      const list = sectionsRef.current;
      if (!list) return;
      commit(setDeep(list, `${index}.${path}`, value), {
        refresh: opts.refresh ?? true,
        coalesceKey: `${index}.${path}`,
      });
    },
    [commit],
  );

  /* -------------------------------- locale -------------------------------- */

  const switchLocale = useCallback(
    async (loc: Locale) => {
      if (loc === localeRef.current) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (dirtyRef.current) await doSave();
      localeRef.current = loc;
      setLocale(loc);
      document.cookie = `${LOCALE_COOKIE}=${loc};path=/;max-age=31536000;samesite=lax`;
      selectedRef.current = null;
      setSelected(null);
      setAdding(false);
      await load(loc);
      setIframeKey((k) => k + 1);
    },
    [doSave, load],
  );

  /* --------------------------------- wiring ------------------------------- */

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${LOCALE_COOKIE}=`))
      ?.split("=")[1];
    const loc: Locale = isLocale(cookie) ? cookie : "ar";
    localeRef.current = loc;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocale(loc);
    document.cookie = `${LOCALE_COOKIE}=${loc};path=/;max-age=31536000;samesite=lax`;
    void load(loc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const msg = e.data as {
        ns?: string;
        type?: string;
        index?: number;
        action?: string;
        path?: string;
        value?: string;
      };
      if (!msg || msg.ns !== VE_NS) return;
      if (msg.type === "ready") {
        postToIframe({ type: "select", index: selectedRef.current });
      } else if (msg.type === "select-section" && typeof msg.index === "number") {
        selectSection(msg.index, { scroll: false });
      } else if (msg.type === "section-action" && typeof msg.index === "number" && msg.action) {
        handleAction(msg.index, msg.action);
      } else if (msg.type === "text" && msg.path) {
        const list = sectionsRef.current;
        if (!list) return;
        const rel = msg.path.replace(/^sections\./, "");
        if (getDeep(list, rel) === msg.value) return;
        commit(setDeep(list, rel, msg.value ?? ""), { refresh: false, coalesceKey: msg.path });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [commit, handleAction, postToIframe, selectSection]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod || e.key.toLowerCase() !== "z") return;
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, [contenteditable]")) return;
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [redo, undo]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current || savingRef.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  /* ---------------------------------- UI ---------------------------------- */

  const section = selected != null && sections ? sections[selected] : null;

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-3">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="rounded-md bg-cyan-400/15 px-2 py-0.5 text-xs font-semibold text-cyan-300">
            Visual Editor
          </span>
          <span className="text-sm font-medium text-zinc-200">Home page</span>
        </div>

        {/* Device toggle */}
        <div className="mx-auto flex items-center gap-1 rounded-lg bg-zinc-800 p-1">
          {(
            [
              ["desktop", Monitor, "Desktop"],
              ["tablet", Tablet, "Tablet"],
              ["mobile", Smartphone, "Mobile"],
            ] as const
          ).map(([d, Icon, title]) => (
            <button
              key={d}
              type="button"
              title={title}
              onClick={() => setDevice(d)}
              className={`flex h-7 w-8 items-center justify-center rounded-md transition-colors ${
                device === d ? "bg-zinc-600 text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        {/* Language being edited */}
        <div className="flex items-center gap-1 rounded-lg bg-zinc-800 p-1 text-xs font-semibold">
          {(["ar", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => void switchLocale(l)}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                locale === l ? "bg-cyan-400 text-cyan-950" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {l === "ar" ? "عربي" : "EN"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Undo (⌘Z)"
            onClick={undo}
            disabled={!canUndo}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-30"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Redo (⌘⇧Z)"
            onClick={redo}
            disabled={!canRedo}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-30"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>

        {/* Save status */}
        <div className="flex w-32 items-center justify-end gap-1.5 text-xs">
          {status === "saved" && (
            <span className="flex items-center gap-1 text-emerald-400">
              <Check className="h-3.5 w-3.5" /> Saved
            </span>
          )}
          {status === "saving" && (
            <span className="flex items-center gap-1 text-zinc-400">
              <CloudUpload className="h-3.5 w-3.5 animate-pulse" /> Saving…
            </span>
          )}
          {status === "loading" && (
            <span className="flex items-center gap-1 text-zinc-400">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Loading…
            </span>
          )}
          {status === "error" && (
            <button
              type="button"
              onClick={() => void doSave()}
              className="flex items-center gap-1 rounded-md bg-red-500/15 px-2 py-1 font-semibold text-red-400 hover:bg-red-500/25"
            >
              <TriangleAlert className="h-3.5 w-3.5" /> Retry save
            </button>
          )}
        </div>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
        >
          <ExternalLink className="h-3.5 w-3.5" /> View site
        </a>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[330px] shrink-0 flex-col overflow-hidden border-e border-zinc-800 bg-zinc-900">
          {sections == null ? (
            <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
              Loading sections…
            </div>
          ) : adding ? (
            <AddSectionPanel onAdd={addSection} onBack={() => setAdding(false)} />
          ) : section != null && selected != null ? (
            <SettingsPanel
              key={`${section.id ?? selected}-${locale}`}
              section={section}
              index={selected}
              total={sections.length}
              onField={handleField}
              onAction={handleAction}
              onBack={() => selectSection(null)}
            />
          ) : (
            <SectionListPanel
              sections={sections}
              selected={selected}
              onSelect={(i) => selectSection(i)}
              onAdd={() => setAdding(true)}
              onAction={handleAction}
              onReorder={reorderSection}
            />
          )}
        </aside>

        <main className="flex min-w-0 flex-1 justify-center overflow-auto bg-zinc-950 p-4">
          <div
            className="h-full transition-[width] duration-300"
            style={{ width: DEVICE_WIDTH[device], maxWidth: "100%" }}
          >
            {sections == null ? (
              <div className="flex h-full items-center justify-center rounded-xl border border-zinc-800 text-sm text-zinc-500">
                Loading preview…
              </div>
            ) : (
              <iframe
                key={iframeKey}
                ref={iframeRef}
                title="Live preview"
                src="/?ve=1"
                className="h-full w-full rounded-xl border border-zinc-800 bg-black"
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
