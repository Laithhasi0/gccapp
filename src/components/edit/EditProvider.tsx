"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Editing modes for the live site.
 *
 * 1. Pencil mode (`?edit=1`) — legacy: hovering a section shows a pencil that
 *    deep-links into the admin. Still used on inner pages (services, about…).
 *
 * 2. Visual Editor mode (`?ve=1`, only when embedded in the /editor iframe) —
 *    the Shopify-style experience. Sections get click-to-select outlines and a
 *    floating toolbar (SectionShell), text becomes editable in place
 *    (EditableText), and everything talks to the parent editor window over
 *    postMessage. In this mode the pencil UI is suppressed.
 *
 * `ready` flips true once the mode has been resolved on the client. Animation
 * code (GSAP pins) waits for `ready` so it never initialises and then has to be
 * torn down when a section switches to its static, editable layout.
 */

type EditState = { edit: boolean; ready: boolean };
const EditContext = createContext<EditState>({ edit: false, ready: false });

export const useEditMode = () => useContext(EditContext).edit;
export const useEditReady = () => useContext(EditContext).ready;

type VEState = { active: boolean; selected: number | null };
const VEContext = createContext<VEState>({ active: false, selected: null });

/** Visual Editor state: whether the page runs inside the /editor iframe. */
export const useVE = () => useContext(VEContext);

export const VE_NS = "gcc-ve";

/** Send a message to the parent Visual Editor window (no-op outside it). */
export function vePost(msg: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.parent !== window) {
    window.parent.postMessage({ ns: VE_NS, ...msg }, window.location.origin);
  }
}

const KEY = "gcc_edit_mode";

export function EditProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<EditState>({ edit: false, ready: false });
  const [ve, setVe] = useState<VEState>({ active: false, selected: null });
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isVe = params.get("ve") === "1" && window.parent !== window;
    const fromUrl = params.get("edit") === "1" || isVe;
    const stored = sessionStorage.getItem(KEY) === "1";
    if (fromUrl && !isVe) sessionStorage.setItem(KEY, "1");
    // Read browser-only state after mount (avoids an SSR/hydration mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ edit: fromUrl || stored, ready: true });
    if (isVe) setVe({ active: true, selected: null });
  }, []);

  // Visual Editor wiring: receive commands from the parent editor window and
  // block real navigation/submission inside the preview.
  useEffect(() => {
    if (!ve.active) return;

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const msg = e.data as { ns?: string; type?: string; index?: number | null };
      if (!msg || msg.ns !== VE_NS) return;
      if (msg.type === "select") {
        setVe((v) => ({ ...v, selected: typeof msg.index === "number" ? msg.index : null }));
      }
      if (msg.type === "scroll-to" && typeof msg.index === "number") {
        document
          .querySelector(`[data-ve-index="${msg.index}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (msg.type === "refresh") router.refresh();
    };

    // Keep the admin inside the editor: clicking links in the preview must not
    // navigate away, and forms must not submit.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element)?.closest?.("a");
      if (a && !a.closest("[data-ve-allow]")) e.preventDefault();
    };
    const onSubmit = (e: Event) => e.preventDefault();

    window.addEventListener("message", onMessage);
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    vePost({ type: "ready" });

    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, [ve.active, router]);

  const exit = () => {
    sessionStorage.removeItem(KEY);
    setState({ edit: false, ready: true });
    const url = new URL(window.location.href);
    url.searchParams.delete("edit");
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <EditContext.Provider value={state}>
      <VEContext.Provider value={ve}>
        {children}
        {state.edit && !ve.active && (
          <div
            style={{ zIndex: 2147483000 }}
            className="fixed inset-x-0 bottom-4 flex justify-center px-4 print:hidden"
          >
            <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-accent/40 bg-background/95 px-4 py-2.5 text-sm shadow-2xl backdrop-blur">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-contrast">
                ✏️
              </span>
              <span className="hidden text-ink sm:inline">
                <strong>Edit mode</strong> — hover any section and click the pencil to edit it.
              </span>
              <span className="text-ink sm:hidden">
                <strong>Edit mode</strong>
              </span>
              <a
                href="/editor"
                className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-contrast hover:bg-accent-hover"
              >
                Visual Editor
              </a>
              <a
                href="/admin"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent hover:bg-accent-soft/70"
              >
                Dashboard
              </a>
              <button
                type="button"
                onClick={exit}
                className="rounded-full px-3 py-1 text-xs font-semibold text-muted hover:text-ink"
              >
                Exit
              </button>
            </div>
          </div>
        )}
      </VEContext.Provider>
    </EditContext.Provider>
  );
}
