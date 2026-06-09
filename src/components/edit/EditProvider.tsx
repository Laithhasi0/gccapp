"use client";

import { createContext, useContext, useEffect, useState } from "react";

/**
 * Click-to-edit ("Visual Control Center") mode for the live site.
 *
 * Activated by visiting any page with `?edit=1` (the dashboard links here).
 * While active, every section wrapped in <Editable> / marked with <EditPencil>
 * shows a pencil that jumps straight to its editor in the admin. The mode is
 * remembered across internal navigation via sessionStorage, and is invisible to
 * normal visitors.
 *
 * `ready` flips true once the mode has been resolved on the client. Animation
 * code (GSAP pins) waits for `ready` so it never initialises and then has to be
 * torn down when a section switches to its static, editable layout.
 */

type EditState = { edit: boolean; ready: boolean };
const EditContext = createContext<EditState>({ edit: false, ready: false });

export const useEditMode = () => useContext(EditContext).edit;
export const useEditReady = () => useContext(EditContext).ready;

const KEY = "gcc_edit_mode";

export function EditProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<EditState>({ edit: false, ready: false });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("edit") === "1";
    const stored = sessionStorage.getItem(KEY) === "1";
    if (fromUrl) sessionStorage.setItem(KEY, "1");
    // Read browser-only state after mount (avoids an SSR/hydration mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ edit: fromUrl || stored, ready: true });
  }, []);

  const exit = () => {
    sessionStorage.removeItem(KEY);
    setState({ edit: false, ready: true });
    const url = new URL(window.location.href);
    url.searchParams.delete("edit");
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <EditContext.Provider value={state}>
      {children}
      {state.edit && (
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
    </EditContext.Provider>
  );
}
