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
import { blockDef, isLocalizedField, type HomeSection } from "@/lib/homeBlocks";
import { isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { getDeep, graftIds, newRowId, setDeep } from "./deep";
import { EDITOR_PAGES } from "./pages";
import { PageInfoPanel } from "./PageInfoPanel";
import { SectionListPanel } from "./SectionListPanel";
import { SettingsPanel, type ArrayOp, type FieldScope } from "./SettingsPanel";
import { AddSectionPanel } from "./AddSectionPanel";

const VE_NS = "gcc-ve";

type Status = "loading" | "saved" | "saving" | "error";
type Device = "desktop" | "tablet" | "mobile";

/** Both languages of the home page, edited together. Structure (sections,
 * rows, order) is always identical between the two trees; only localized
 * text differs. */
type Trees = { ar: HomeSection[]; en: HomeSection[] };

const DEVICE_WIDTH: Record<Device, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

/** Strips row ids (so Payload assigns fresh ones) on duplicated sections. */
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
  const [trees, _setTrees] = useState<Trees | null>(null);
  const [previewLocale, setPreviewLocale] = useState<Locale>("ar");
  const [page, setPage] = useState("/");
  const [selected, setSelected] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [device, setDevice] = useState<Device>("desktop");
  const [status, setStatus] = useState<Status>("loading");
  const [iframeKey, setIframeKey] = useState(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const treesRef = useRef<Trees | null>(null);
  const selectedRef = useRef<number | null>(null);
  const previewLocaleRef = useRef<Locale>("ar");
  const historyRef = useRef<{ past: Trees[]; future: Trees[] }>({ past: [], future: [] });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRefresh = useRef(false);
  const dirtyRef = useRef(false);
  const savingRef = useRef(false);
  const coalesceRef = useRef<{ key: string; at: number } | null>(null);

  const setTrees = useCallback((next: Trees | null) => {
    treesRef.current = next;
    _setTrees(next);
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

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const [resAr, resEn] = await Promise.all([
        fetch("/api/editor/home?locale=ar"),
        fetch("/api/editor/home?locale=en"),
      ]);
      if (resAr.status === 401 || resEn.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const [ar, en] = await Promise.all([resAr.json(), resEn.json()]);
      setTrees({ ar: ar.sections, en: en.sections });
      historyRef.current = { past: [], future: [] };
      dirtyRef.current = false;
      syncHistoryFlags();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }, [setTrees, syncHistoryFlags]);

  const doSave = useCallback(async () => {
    if (savingRef.current || !treesRef.current) return;
    savingRef.current = true;
    setStatus("saving");
    const snapshot = treesRef.current;
    const refresh = pendingRefresh.current;
    pendingRefresh.current = false;
    try {
      const post = async (sections: HomeSection[], locale: Locale) => {
        const res = await fetch("/api/editor/home", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sections, locale }),
        });
        if (!res.ok) throw new Error(`save failed (${res.status})`);
        return (await res.json()) as { sections: HomeSection[] };
      };
      // Save Arabic first, then graft the server-assigned row ids onto the
      // English tree before saving it — both languages stay on the same rows.
      const savedAr = await post(snapshot.ar, "ar");
      const savedEn = await post(graftIds(savedAr.sections, snapshot.en), "en");
      savingRef.current = false;
      if (treesRef.current === snapshot) {
        setTrees({ ar: savedAr.sections, en: savedEn.sections });
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
  }, [postToIframe, setTrees]);

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
    (next: Trees, opts: { refresh?: boolean; coalesceKey?: string } = {}) => {
      const { refresh = true, coalesceKey } = opts;
      const prev = treesRef.current;
      if (prev) {
        const now = Date.now();
        const last = coalesceRef.current;
        const coalesce = coalesceKey && last && last.key === coalesceKey && now - last.at < 1500;
        if (!coalesce) historyRef.current.past.push(prev);
        if (historyRef.current.past.length > 100) historyRef.current.past.shift();
        historyRef.current.future = [];
        coalesceRef.current = coalesceKey ? { key: coalesceKey, at: now } : null;
      }
      setTrees(next);
      dirtyRef.current = true;
      if (refresh) pendingRefresh.current = true;
      syncHistoryFlags();
      scheduleSave();
    },
    [scheduleSave, setTrees, syncHistoryFlags],
  );

  /** Applies the same structural transform to both language trees. */
  const commitBoth = useCallback(
    (fn: (sections: HomeSection[]) => HomeSection[], opts?: { coalesceKey?: string }) => {
      const t = treesRef.current;
      if (!t) return;
      commit({ ar: fn(t.ar), en: fn(t.en) }, opts);
    },
    [commit],
  );

  const undo = useCallback(() => {
    const { past, future } = historyRef.current;
    const prev = past.pop();
    if (!prev || !treesRef.current) return;
    future.push(treesRef.current);
    coalesceRef.current = null;
    setTrees(prev);
    dirtyRef.current = true;
    pendingRefresh.current = true;
    syncHistoryFlags();
    scheduleSave();
  }, [scheduleSave, setTrees, syncHistoryFlags]);

  const redo = useCallback(() => {
    const { past, future } = historyRef.current;
    const next = future.pop();
    if (!next || !treesRef.current) return;
    past.push(treesRef.current);
    coalesceRef.current = null;
    setTrees(next);
    dirtyRef.current = true;
    pendingRefresh.current = true;
    syncHistoryFlags();
    scheduleSave();
  }, [scheduleSave, setTrees, syncHistoryFlags]);

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

  const reorderSection = useCallback(
    (from: number, to: number) => {
      if (from === to) return;
      commitBoth((list) => {
        if (to < 0 || to >= list.length) return list;
        const next = list.slice();
        const [row] = next.splice(from, 1);
        next.splice(to, 0, row);
        return next;
      });
      const len = treesRef.current?.ar.length ?? 0;
      if (to >= 0 && to < len) selectSection(to, { scroll: false });
    },
    [commitBoth, selectSection],
  );

  const moveSection = useCallback(
    (index: number, dir: -1 | 1) => reorderSection(index, index + dir),
    [reorderSection],
  );

  const toggleHidden = useCallback(
    (index: number) => {
      commitBoth((list) => setDeep(list, `${index}.hidden`, !list[index]?.hidden));
    },
    [commitBoth],
  );

  const duplicateSection = useCallback(
    (index: number) => {
      const t = treesRef.current;
      if (!t) return;
      const dupAr = withFreshIds(t.ar[index]);
      const dupEn = { ...withFreshIds(t.en[index]), id: dupAr.id };
      const insert = (list: HomeSection[], dup: HomeSection) => {
        const next = list.slice();
        next.splice(index + 1, 0, dup);
        return next;
      };
      commit({ ar: insert(t.ar, dupAr), en: insert(t.en, dupEn) });
      selectSection(index + 1, { scroll: false });
    },
    [commit, selectSection],
  );

  const removeSection = useCallback(
    (index: number) => {
      const t = treesRef.current;
      if (!t) return;
      const label = blockDef(t.ar[index]?.type)?.label ?? t.ar[index]?.type;
      if (!window.confirm(`Delete the "${label}" section? You can undo this.`)) return;
      commitBoth((list) => list.filter((_, i) => i !== index));
      selectSection(null);
    },
    [commitBoth, selectSection],
  );

  const addSection = useCallback(
    (type: string) => {
      const t = treesRef.current;
      const def = blockDef(type);
      if (!t || !def) return;
      // Pre-fill the new section in BOTH languages.
      const id = newRowId();
      const freshAr = { ...def.defaults("ar"), id };
      const freshEn = { ...def.defaults("en"), id };
      const at = selectedRef.current != null ? selectedRef.current + 1 : t.ar.length;
      const insert = (list: HomeSection[], fresh: HomeSection) => {
        const next = list.slice();
        next.splice(at, 0, fresh);
        return next;
      };
      commit({ ar: insert(t.ar, freshAr), en: insert(t.en, freshEn) });
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

  /**
   * Settings-panel field edit. Localized text writes to one language tree;
   * shared values (links, images, toggles, stat values) write to both.
   */
  const handleField = useCallback(
    (index: number, path: string, value: unknown, scope: FieldScope) => {
      const t = treesRef.current;
      if (!t) return;
      const full = `${index}.${path}`;
      const next: Trees =
        scope === "shared"
          ? { ar: setDeep(t.ar, full, value), en: setDeep(t.en, full, value) }
          : { ...t, [scope]: setDeep(t[scope], full, value) };
      commit(next, { coalesceKey: `${scope}:${full}` });
    },
    [commit],
  );

  /** Array row operations (add/move/remove) apply to both trees in lockstep. */
  const handleArrayOp = useCallback(
    (index: number, path: string, op: ArrayOp) => {
      const full = `${index}.${path}`;
      commitBoth((list) => {
        const rows = ((getDeep(list, full) as Record<string, unknown>[]) || []).slice();
        if (op.kind === "move") {
          if (op.to < 0 || op.to >= rows.length) return list;
          const [r] = rows.splice(op.from, 1);
          rows.splice(op.to, 0, r);
        } else if (op.kind === "remove") {
          rows.splice(op.at, 1);
        } else if (op.kind === "add") {
          rows.push(JSON.parse(JSON.stringify(op.row)) as Record<string, unknown>);
        }
        return setDeep(list, full, rows);
      });
    },
    [commitBoth],
  );

  /* ----------------------- preview language & pages ----------------------- */

  const switchPreviewLocale = useCallback((loc: Locale) => {
    if (loc === previewLocaleRef.current) return;
    previewLocaleRef.current = loc;
    setPreviewLocale(loc);
    document.cookie = `${LOCALE_COOKIE}=${loc};path=/;max-age=31536000;samesite=lax`;
    setIframeKey((k) => k + 1);
  }, []);

  const switchPage = useCallback(
    (path: string) => {
      setPage(path);
      selectSection(null);
      setIframeKey((k) => k + 1);
    },
    [selectSection],
  );

  /* --------------------------------- wiring ------------------------------- */

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${LOCALE_COOKIE}=`))
      ?.split("=")[1];
    const loc: Locale = isLocale(cookie) ? cookie : "ar";
    previewLocaleRef.current = loc;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviewLocale(loc);
    document.cookie = `${LOCALE_COOKIE}=${loc};path=/;max-age=31536000;samesite=lax`;
    void load();
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
        href?: string;
      };
      if (!msg || msg.ns !== VE_NS) return;
      if (msg.type === "ready") {
        postToIframe({ type: "select", index: selectedRef.current });
      } else if (msg.type === "open-admin" && msg.href) {
        window.open(msg.href, "_blank");
      } else if (msg.type === "select-section" && typeof msg.index === "number") {
        selectSection(msg.index, { scroll: false });
      } else if (msg.type === "section-action" && typeof msg.index === "number" && msg.action) {
        handleAction(msg.index, msg.action);
      } else if (msg.type === "text" && msg.path) {
        const t = treesRef.current;
        if (!t) return;
        const rel = msg.path.replace(/^sections\./, "");
        const loc = previewLocaleRef.current;
        const value = msg.value ?? "";
        if (isLocalizedField(rel)) {
          if (getDeep(t[loc], rel) === value) return;
          commit({ ...t, [loc]: setDeep(t[loc], rel, value) }, { refresh: false, coalesceKey: `${loc}:${rel}` });
        } else {
          if (getDeep(t[loc], rel) === value) return;
          commit(
            { ar: setDeep(t.ar, rel, value), en: setDeep(t.en, rel, value) },
            { refresh: false, coalesceKey: `shared:${rel}` },
          );
        }
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

  const currentPage = EDITOR_PAGES.find((p) => p.path === page) ?? EDITOR_PAGES[0];
  const isHome = currentPage.visual === true;
  const sectionAr = selected != null && trees ? trees.ar[selected] : null;
  const sectionEn = selected != null && trees ? trees.en[selected] : null;

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
        <span className="hidden rounded-md bg-cyan-400/15 px-2 py-0.5 text-xs font-semibold text-cyan-300 sm:inline">
          Visual Editor
        </span>

        {/* Page switcher */}
        <select
          value={page}
          onChange={(e) => switchPage(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-sm font-medium text-zinc-100 outline-none focus:border-cyan-400"
        >
          {EDITOR_PAGES.map((p) => (
            <option key={p.path} value={p.path}>
              {p.icon} {p.label}
            </option>
          ))}
        </select>

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

        {/* Preview language (text fields always show BOTH languages) */}
        <div
          className="flex items-center gap-1 rounded-lg bg-zinc-800 p-1 text-xs font-semibold"
          title="Preview language — text fields always show both languages"
        >
          {(["ar", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => switchPreviewLocale(l)}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                previewLocale === l ? "bg-cyan-400 text-cyan-950" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {l === "ar" ? "عربي" : "EN"}
            </button>
          ))}
        </div>

        {isHome && (
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
        )}

        {/* Save status */}
        <div className="flex w-28 items-center justify-end gap-1.5 text-xs">
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
          href={page}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
        >
          <ExternalLink className="h-3.5 w-3.5" /> View
        </a>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[360px] shrink-0 flex-col overflow-hidden border-e border-zinc-800 bg-zinc-900">
          {!isHome ? (
            <PageInfoPanel page={currentPage} />
          ) : trees == null ? (
            <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
              Loading sections…
            </div>
          ) : adding ? (
            <AddSectionPanel onAdd={addSection} onBack={() => setAdding(false)} />
          ) : sectionAr != null && sectionEn != null && selected != null ? (
            <SettingsPanel
              key={`${sectionAr.id ?? selected}`}
              sectionAr={sectionAr}
              sectionEn={sectionEn}
              index={selected}
              total={trees.ar.length}
              onField={handleField}
              onArrayOp={handleArrayOp}
              onAction={handleAction}
              onBack={() => selectSection(null)}
            />
          ) : (
            <SectionListPanel
              sections={trees[previewLocale]}
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
            {trees == null ? (
              <div className="flex h-full items-center justify-center rounded-xl border border-zinc-800 text-sm text-zinc-500">
                Loading preview…
              </div>
            ) : (
              <iframe
                key={`${iframeKey}-${page}`}
                ref={iframeRef}
                title="Live preview"
                src={`${page}?ve=1`}
                className="h-full w-full rounded-xl border border-zinc-800 bg-black"
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
