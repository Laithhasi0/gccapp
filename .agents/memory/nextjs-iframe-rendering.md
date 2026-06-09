---
name: Next.js content invisible in Replit iframe preview
description: Two header/animation gotchas that make a Next.js site render blank (or only the footer) inside Replit's proxied iframe preview.
---

# Next.js rendering inside Replit's iframe preview

Replit shows the running app inside a cross-origin iframe (the `*.replit.dev` proxy). Two separate things can make the page appear blank to the user even though `app_preview` screenshots and server logs look fine:

## 1. `X-Frame-Options: SAMEORIGIN` blocks the whole preview
If `next.config.ts` `headers()` sets `X-Frame-Options: SAMEORIGIN`, the browser refuses to render the app inside Replit's iframe → totally blank preview. Remove the header for public sites (or don't set it). `Content-Security-Policy: frame-ancestors` has the same risk.

**How to apply:** when a Next.js app shows blank ONLY in the iframe preview but the screenshot tool works, check `headers()` in next.config.ts first.

## 2. JS-driven `opacity:0` wrappers leave content invisible ("only the footer shows")
The App Router `template.tsx` wrapped all page content in a Framer Motion `motion.div` with `initial={{opacity:0}}` → `animate={{opacity:1}}`. The footer lives in `layout.tsx` (outside the template) so it stayed visible, but everything inside the template depended on client-side JS completing the animation. In the throttled iframe context the animation didn't run, so content was stuck at `opacity:0`.

**Why:** content visibility must never depend on client JS finishing. Iframes/embeds can throttle or delay rAF-based animations.

**How to apply:** prefer a pure CSS keyframe animation (`animation: page-enter .35s both`) over JS-controlled opacity for any wrapper that gates visibility. CSS animations run without hydration and always settle at the final state; reduced-motion rules in globals.css collapse the duration. Same principle for scroll-reveal: always include a timed fallback that forces `shown=true`.

## Note: Three.js / WebGL errors are expected here
`THREE.WebGLRenderer: ... could not create a WebGL context` logs in the dev container are harmless — no GPU. Components fall back to a static image; do not chase these when debugging blank pages.
