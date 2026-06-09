/**
 * One-time media optimisation for fast serving (especially on Replit, where the
 * Next image optimiser is slow/unreliable).
 *
 *  - public/media/images/*.png  → converted to small WebP (the .png is removed).
 *    Code references use .webp (see the repo). Re-run is safe (skips existing).
 *  - public/media/uploads/*     → recompressed in place (kept as-is, because the
 *    Payload database references those exact filenames). Photos are resized and
 *    re-encoded; run this on Replit after uploading new media.
 *
 * Run:  node scripts/compress-media.mjs
 */
import sharp from "sharp";
import { readdirSync, statSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import path from "node:path";

const MAX = 1600; // max dimension — plenty for full-bleed visuals
let before = 0;
let after = 0;
let count = 0;

async function fit(buf, width) {
  return width && width > MAX ? sharp(buf).resize({ width: MAX, withoutEnlargement: true }) : sharp(buf);
}

// 1. Static images → WebP
const imgDir = "public/media/images";
for (const f of safeList(imgDir)) {
  if (!/\.png$/i.test(f)) continue;
  const src = path.join(imgDir, f);
  const out = src.replace(/\.png$/i, ".webp");
  const orig = statSync(src).size;
  if (existsSync(out)) {
    before += orig;
    after += statSync(out).size;
    unlinkSync(src); // already converted on a previous run
    continue;
  }
  const meta = await sharp(src).metadata();
  const buf = await (await fit(src, meta.width)).webp({ quality: 78, effort: 5 }).toBuffer();
  writeFileSync(out, buf);
  unlinkSync(src);
  before += orig;
  after += buf.length;
  count++;
  console.log(`webp  ${f}  ${(orig / 1e6).toFixed(1)}MB → ${(buf.length / 1e6).toFixed(2)}MB`);
}

// 2. Payload uploads → recompress in place (keep filename/extension)
const upDir = "public/media/uploads";
for (const f of safeList(upDir)) {
  if (!/\.(png|jpe?g)$/i.test(f)) continue;
  const src = path.join(upDir, f);
  const orig = statSync(src).size;
  if (orig < 250_000) { before += orig; after += orig; continue; } // already small
  const isPng = /\.png$/i.test(f);
  const meta = await sharp(src).metadata();
  const pipe = await fit(src, meta.width);
  const buf = isPng
    ? await pipe.png({ compressionLevel: 9, quality: 82, effort: 8, palette: true }).toBuffer()
    : await pipe.jpeg({ quality: 78, mozjpeg: true }).toBuffer();
  if (buf.length < orig) {
    writeFileSync(src, buf);
    after += buf.length;
    count++;
    console.log(`opt   ${f}  ${(orig / 1e6).toFixed(1)}MB → ${(buf.length / 1e6).toFixed(2)}MB`);
  } else {
    after += orig;
  }
  before += orig;
}

console.log(`\n✓ ${count} files optimised — ${(before / 1e6).toFixed(0)}MB → ${(after / 1e6).toFixed(0)}MB`);

function safeList(dir) {
  try {
    return readdirSync(dir);
  } catch {
    return [];
  }
}
