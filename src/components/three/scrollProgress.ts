"use client";

import { useSyncExternalStore } from "react";

/**
 * A tiny external store holding a single normalized scroll progress value
 * (0 → 1 across the whole page) plus normalized pointer (-1..1).
 *
 * The 3D scene reads `getScrollProgress()` directly inside its render loop
 * (no React re-renders), while non-3D consumers can subscribe via the hook.
 */

let progress = 0;
let pointerX = 0;
let pointerY = 0;
const listeners = new Set<() => void>();

export function setScrollProgress(p: number) {
  progress = Math.min(1, Math.max(0, p));
  listeners.forEach((l) => l());
}

export function getScrollProgress() {
  return progress;
}

export function setPointer(x: number, y: number) {
  pointerX = x;
  pointerY = y;
}

export function getPointer() {
  return { x: pointerX, y: pointerY };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** React hook for non-3D consumers that want to re-render on scroll. */
export function useScrollProgress() {
  return useSyncExternalStore(
    subscribe,
    getScrollProgress,
    () => 0, // SSR snapshot
  );
}
