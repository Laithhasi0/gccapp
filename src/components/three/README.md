# Scroll-driven 3D system

A single, persistent, full-viewport `<Canvas>` (mounted once in the root layout)
whose scene is **scrubbed to scroll** — no autoplay. Calm cyan/white, matte, no glow.

## Files

| File | Role |
|------|------|
| `Scene3DRoot.tsx` | Fixed full-screen host (z-0, `pointer-events:none`). Detects device/motion, lazy-loads the 3D bundle, pauses on tab hidden. **Mounted once** in `app/layout.tsx`. |
| `Scene3D.tsx` | The Canvas + procedural scene + scroll choreography. Code-split (dynamic import) — **not in the initial JS**. |
| `Scene3DFallback.tsx` | Static fallback for reduced-motion / mobile / loading — a pre-rendered frame of the real scene (`public/media/images/scene-3d-fallback.webp`). |
| `scrollProgress.ts` | Tiny store holding normalized scroll progress `0→1` and pointer. |
| `../motion/SmoothScroll.tsx` | Lenis + GSAP ScrollTrigger; publishes the `0→1` progress that drives the scene. |

## How the scene is driven

`SmoothScroll` (Lenis) emits a single normalized progress `0→1` across the whole
page into `scrollProgress.ts`. `Scene3D` reads `getScrollProgress()` inside
`useFrame` and maps it to position / rotation / scale / camera — so motion is
perfectly tied to scroll position (scrubbed). A slow idle float + spin is layered
on top, and fine-pointer devices get a ±3° parallax.

## Change the object / material / colors

All in **`Scene3D.tsx`**:

- **Shape** — edit `SceneContent`. Form A is `<RoundedBox>`, Form B is
  `<Icosahedron>`. Swap either for any drei/three geometry (e.g. `<TorusKnot>`,
  `<Sphere>`). To use a `.glb` instead: `useGLTF('/model.glb')` (drei) and compress
  with Draco/meshopt; drop it into the `<group ref={group}>`.
- **Material** — edit the `MatteMaterial` component (one place). Defaults:
  `color="#e8edef"`, `roughness 0.62`, `metalness 0.05`. Keep `emissive` off (no glow).
- **Cyan accent** — the `<torusGeometry>` ring uses `color="#129eb4"`. Change or remove it.
- **Choreography** — edit the `keyframe(...)` tables in `useFrame`
  (`[progress, value]` pairs) for x-drift, scale and camera dolly. The crossfade
  point between Form A and Form B is `smoothstep(0.42, 0.62, p)`.

## Performance guardrails (already in place)

- 3D bundle is **dynamically imported** → not in the initial JS (verified: Three.js
  lives in its own async chunk).
- `dpr={[1, 1.75]}`, lightweight primitive geometry, `ContactShadows` (cheap, no glow).
- Rendering **pauses when the tab is hidden** (`frameloop="never"`).
- Mobile/coarse-pointer → static fallback (no WebGL). Tablet/low-core → simplified
  scene (lower poly, no contact shadow, no parallax).
- `prefers-reduced-motion` → static fallback, no motion.

## Regenerating the static fallback image

The fallback (`public/media/images/scene-3d-fallback.webp`) is a real frame of the
scene, captured from the running app via headless Google Chrome. Re-run it after
changing the object/material/colors:

```bash
npm run dev            # in one terminal
npm run capture:3d     # in another — writes the transparent .webp
```

Script: `scripts/capture-3d-fallback.mjs` (uses `puppeteer-core` + system Chrome,
no Chromium download). It hides page chrome, isolates the canvas, and screenshots
a transparent 900×900 WebP so the fallback works on light and dark backgrounds.

## Test the fallback

**Reduced motion** (→ static fallback, no canvas):
- macOS: System Settings → Accessibility → Display → **Reduce motion**, reload.
- DevTools: Command palette → "Show Rendering" → **Emulate CSS prefers-reduced-motion: reduce**.

**Mobile / low-power** (→ static fallback or simplified scene):
- DevTools device toolbar (`Cmd/Ctrl+Shift+M`) → pick a phone → reload. A phone
  (coarse pointer + ≤768px) renders the static fallback; a tablet renders the
  simplified scene.

**Confirm the bundle split:**
```bash
npm run build      # Three.js is in its own chunk, not the route entry chunks
```

**Inspect which mode is active** at runtime: the host element carries
`data-scene-mode="full | simplified | static | loading"`.
