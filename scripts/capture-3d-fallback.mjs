/**
 * Pre-render a single frame of the real Three.js scene to a static WebP,
 * used as the high-fidelity fallback for mobile / reduced-motion users.
 *
 * Requires the dev server running on http://localhost:3000 and Google Chrome.
 * Run:  node scripts/capture-3d-fallback.mjs
 */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = "http://localhost:3000/";
const OUT = "public/media/images/scene-3d-fallback.webp";
const SIZE = 900;
const DEBUG = process.env.DEBUG === "1";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: [
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
    "--enable-webgl",
    "--no-sandbox",
  ],
});

try {
  const page = await browser.newPage();
  page.on("console", (m) => console.log("  [page]", m.type(), m.text()));
  page.on("pageerror", (e) => console.log("  [pageerror]", e.message));

  await page.setViewport({ width: SIZE, height: SIZE, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  await page.waitForSelector("canvas", { timeout: 30000 });

  // Hide page chrome + hero video; keep a solid off-white page background so the
  // matte form reads correctly, and lift the canvas above everything.
  await page.addStyleTag({
    content: `
      header, footer, main { display: none !important; }
      video { display: none !important; }
      html, body { background: transparent !important; }
      [data-scene-mode] { z-index: 9999 !important; }
      /* hide Next.js dev indicator / overlays */
      nextjs-portal,
      [data-nextjs-toast],
      [data-next-badge-root],
      #__next-dev-tools-indicator { display: none !important; }
    `,
  });

  await new Promise((r) => setTimeout(r, 2000));

  // Diagnostics: confirm the WebGL canvas actually drew something.
  const diag = await page.evaluate(() => {
    const host = document.querySelector("[data-scene-mode]");
    const c = document.querySelector("canvas");
    let gl = null;
    try {
      gl = c && (c.getContext("webgl2") || c.getContext("webgl"));
    } catch {}
    return {
      mode: host?.getAttribute("data-scene-mode"),
      canvas: c ? `${c.width}x${c.height}` : null,
      hasGL: !!gl,
      glError: gl ? gl.getError() : null,
    };
  });
  console.log("  diag:", JSON.stringify(diag));

  mkdirSync(dirname(OUT), { recursive: true });
  await page.screenshot({
    path: OUT,
    type: "webp",
    quality: 82,
    omitBackground: true, // transparent — theme-agnostic fallback
    clip: { x: 0, y: 0, width: SIZE, height: SIZE },
  });

  if (DEBUG) {
    await page.screenshot({ path: "tmp/scene-debug.png", type: "png" });
  }

  console.log(`✓ Saved ${OUT} (${SIZE}x${SIZE}, webp)`);
} finally {
  await browser.close();
}
