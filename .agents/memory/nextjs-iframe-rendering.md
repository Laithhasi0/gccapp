---
name: Next.js content invisible in Replit iframe preview
description: Two header/animation gotchas that make a Next.js site render blank (or only the footer) inside Replit's proxied iframe preview.
---

# Next.js rendering inside Replit's iframe preview

Replit shows the running app inside a cross-origin iframe (the `*.replit.dev` proxy). Two separate things can make the page appear blank to the user even though `app_preview` screenshots and server logs look fine:

## 1. `X-Frame-Options: SAMEORIGIN` blocks the whole preview
If `next.config.ts` `headers()` sets `X-Frame-Options: SAMEORIGIN`, the browser refuses to render the app inside Replit's iframe → totally blank preview. Remove the header for public sites (or don't set it). `Content-Security-Policy: frame-ancestors` has the same risk.

**How to apply:** when a Next.js app shows blank ONLY in the iframe preview but the screenshot tool works, check `headers()` in next.config.ts first.

## 2. JS-driven `opacity:0` reveals leave content invisible ("only the footer shows")
Any element rendered with `opacity:0` that relies on client JS to become visible can get stuck invisible inside Replit's iframe (the footer in `layout.tsx` has no opacity gate, so it alone showed). Three culprits in this codebase, all fixed by making visibility independent of JS:
- App Router `template.tsx`: Framer Motion `initial opacity:0 → animate opacity:1` wrapper → replaced with a pure CSS keyframe (`.page-enter`, opacity only — no transform, which would break sticky scroll sections).
- A scroll-reveal component (`Reveal`): was `useEffect`+IntersectionObserver+setTimeout toggling opacity → replaced with a pure CSS keyframe using `animation-fill-mode: both` (always settles at opacity:1). Became hook-free so `'use client'` was dropped; safe to import from both server and client components.
- Framer Motion `AnimatePresence` panels (tabs / sticky scroll): the first/active panel's `initial={{opacity:0}}` is serialized into SSR HTML and only clears when JS animates. Fix: add `initial={false}` to `AnimatePresence` so the first panel renders at its `animate` (visible) state in SSR while transitions still animate.

**Why:** content visibility must never depend on client JS finishing. Iframes/embeds can throttle or pause rAF/IntersectionObserver callbacks, leaving JS-gated opacity stuck at 0.

**How to apply:** diagnose by `curl`-ing the page and counting inline `opacity:0` styles — every one is a JS-dependent visibility gate. Drive them to 0. Prefer CSS keyframes (`both` fill) over JS-toggled opacity; use `AnimatePresence initial={false}` for first-paint panels. Keep `animation-delay`/`transition-delay` zeroed in the `prefers-reduced-motion` block too, not just duration.

## Note: Three.js / WebGL errors are expected here
`THREE.WebGLRenderer: ... could not create a WebGL context` logs in the dev container are harmless — no GPU. Components fall back to a static image; do not chase these when debugging blank pages.

## 3. Scroll-jacking sections must use GSAP ScrollTrigger, not Framer Motion useScroll
This app's smooth scrolling is Lenis wired to GSAP ScrollTrigger in `SmoothScroll.tsx` (`lenis.on('scroll', ScrollTrigger.update)` + gsap.ticker driving `lenis.raf`). Any pin / horizontal-scroll / scroll-progress section must be built on GSAP ScrollTrigger so it reads the same scroll source. Sections that instead used Framer Motion `useScroll` + CSS `sticky` desynced from Lenis and the pin/horizontal-scroll misbehaved.

**Why:** two independent scroll engines (Lenis-smoothed position vs Framer's own measurement) drift apart; the visual effect lags or jumps.

**How to apply:** use `gsap.context()` scoped to a section ref with `ScrollTrigger.create/gsap.to({ pin: <innerRef>, scrub, end: () => '+=' + dynamicDistance(), invalidateOnRefresh: true })`; return `ctx.revert()` from the effect (handles React Strict Mode double-mount). For scroll→state mapping, guard `setActive` to only fire on index change and mutate progress bars imperatively via a ref to avoid per-frame re-renders. Call `ScrollTrigger.refresh()` ~600ms after mount so image/font layout shifts get correct measured distances. Keep a `useReducedMotion()` fallback that renders a plain (non-pinned) layout.
