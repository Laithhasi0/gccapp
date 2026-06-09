/**
 * Generates premium portfolio showcase artwork (cover posters + phone-mockup
 * gallery screens) for the GCC App case-study apps, rendered as compact WebP.
 *
 * No external assets — everything is drawn as SVG and rasterised with sharp.
 * Output: public/media/images/portfolio/<slug>-cover.webp  (1600x900)
 *         public/media/images/portfolio/<slug>-1|2|3.webp  (820x1640 phone)
 *
 * Run:  node scripts/generate-portfolio-art.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve("public/media/images/portfolio");
mkdirSync(OUT, { recursive: true });

const FONT = "Helvetica, Arial, sans-serif";

/* ------------------------------ small helpers ----------------------------- */

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** A rounded "phone" with a themed app screen inside. */
function phone(t, screen, { x = 0, y = 0, w = 300, h = 620 } = {}) {
  const r = 46;
  const bezel = 14;
  const sx = x + bezel;
  const sy = y + bezel;
  const sw = w - bezel * 2;
  const sh = h - bezel * 2;
  return `
  <g transform="translate(${x},${y})">
    <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" fill="#05060c"/>
    <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="${r - 2}" fill="none" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="1.5"/>
  </g>
  <g transform="translate(${sx},${sy})">
    <rect x="0" y="0" width="${sw}" height="${sh}" rx="${r - bezel}" fill="${t.bg2}"/>
    ${screen(t, sw, sh)}
  </g>
  <rect x="${sx + sw / 2 - 34}" y="${sy + 12}" width="68" height="9" rx="4.5" fill="#05060c"/>
  `;
}

/** Generic app screen: status bar, header, hero card, list rows, bottom nav. */
function appScreen(t, w, h, opts) {
  const pad = 18;
  const cardW = w - pad * 2;
  const navY = h - 64;
  const rows = opts.rows || [];
  const rowH = 52;
  const listTop = 196;
  return `
    <!-- status bar -->
    <text x="${pad}" y="34" font-family="${FONT}" font-size="13" fill="#fff" font-weight="600">9:41</text>
    <g transform="translate(${w - pad - 52},24)" fill="#fff" fill-opacity="0.85">
      <rect x="0" y="2" width="16" height="9" rx="2"/><rect x="20" y="0" width="14" height="11" rx="2"/>
      <rect x="38" y="0" width="22" height="11" rx="3" stroke="#fff" stroke-opacity="0.5" fill="none"/>
      <rect x="40" y="2" width="16" height="7" rx="1.5"/>
    </g>
    <!-- header -->
    <text x="${pad}" y="74" font-family="${FONT}" font-size="13" fill="${t.accent}" font-weight="700" letter-spacing="2">${esc(opts.eyebrow)}</text>
    <text x="${pad}" y="102" font-family="${FONT}" font-size="22" fill="#fff" font-weight="800">${esc(opts.title)}</text>
    <circle cx="${w - pad - 14}" cy="86" r="16" fill="${t.accent}" fill-opacity="0.18"/>
    <circle cx="${w - pad - 14}" cy="86" r="16" fill="none" stroke="${t.accent}" stroke-opacity="0.5"/>
    <!-- hero card -->
    <rect x="${pad}" y="124" width="${cardW}" height="56" rx="16" fill="url(#heroGrad)"/>
    <text x="${pad + 18}" y="150" font-family="${FONT}" font-size="13" fill="#fff" font-weight="700">${esc(opts.cardTitle)}</text>
    <text x="${pad + 18}" y="168" font-family="${FONT}" font-size="11" fill="#fff" fill-opacity="0.85">${esc(opts.cardSub)}</text>
    <!-- list rows -->
    ${rows.map((row, i) => {
      const ry = listTop + i * (rowH + 10);
      return `
      <rect x="${pad}" y="${ry}" width="${cardW}" height="${rowH}" rx="14" fill="#ffffff" fill-opacity="0.05" stroke="${t.accent}" stroke-opacity="0.12"/>
      <circle cx="${pad + 26}" cy="${ry + rowH / 2}" r="14" fill="${t.accent}" fill-opacity="0.2"/>
      <circle cx="${pad + 26}" cy="${ry + rowH / 2}" r="6" fill="${t.accent}"/>
      <text x="${pad + 52}" y="${ry + 24}" font-family="${FONT}" font-size="13" fill="#fff" font-weight="600">${esc(row[0])}</text>
      <text x="${pad + 52}" y="${ry + 40}" font-family="${FONT}" font-size="10.5" fill="#fff" fill-opacity="0.55">${esc(row[1])}</text>
      <text x="${w - pad - 16}" y="${ry + rowH / 2 + 4}" text-anchor="end" font-family="${FONT}" font-size="12" fill="${t.accent}" font-weight="700">${esc(row[2] || "")}</text>`;
    }).join("")}
    <!-- bottom nav -->
    <rect x="${pad}" y="${navY}" width="${cardW}" height="48" rx="20" fill="#05060c" fill-opacity="0.6" stroke="${t.accent}" stroke-opacity="0.15"/>
    ${[0, 1, 2, 3].map((i) => {
      const cx = pad + 38 + i * ((cardW - 76) / 3);
      const active = i === (opts.activeNav ?? 0);
      return `<circle cx="${cx}" cy="${navY + 24}" r="${active ? 9 : 6}" fill="${active ? t.accent : "#ffffff"}" fill-opacity="${active ? 1 : 0.3}"/>`;
    }).join("")}
  `;
}

/* --------------------------------- covers -------------------------------- */

function coverSVG(t) {
  const W = 1600, H = 900;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.bg1}"/><stop offset="1" stop-color="${t.bg2}"/>
    </linearGradient>
    <radialGradient id="glow1" cx="78%" cy="28%" r="55%">
      <stop offset="0" stop-color="${t.accent}" stop-opacity="0.45"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="18%" cy="88%" r="55%">
      <stop offset="0" stop-color="${t.accent2}" stop-opacity="0.4"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.accent}"/><stop offset="1" stop-color="${t.accent2}"/>
    </linearGradient>
    <linearGradient id="title" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${t.accent}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow1)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>
  <!-- subtle grid -->
  <g stroke="${t.accent}" stroke-opacity="0.06">
    ${Array.from({ length: 16 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="${H}"/>`).join("")}
    ${Array.from({ length: 9 }, (_, i) => `<line x1="0" y1="${i * 100}" x2="${W}" y2="${i * 100}"/>`).join("")}
  </g>

  <!-- left: text -->
  <g transform="translate(110,150)">
    <rect x="0" y="0" width="${20 + t.brand.length * 9.2}" height="40" rx="20" fill="${t.accent}" fill-opacity="0.14" stroke="${t.accent}" stroke-opacity="0.4"/>
    <text x="22" y="26" font-family="${FONT}" font-size="16" fill="${t.accent}" font-weight="700" letter-spacing="1.5">${esc(t.brand)}</text>
    <text x="0" y="150" font-family="${FONT}" font-size="84" font-weight="800" fill="url(#title)">${esc(t.name1)}</text>
    <text x="0" y="240" font-family="${FONT}" font-size="84" font-weight="800" fill="#ffffff">${esc(t.name2)}</text>
    <text x="2" y="300" font-family="${FONT}" font-size="26" fill="#ffffff" fill-opacity="0.7" font-weight="500">${esc(t.tagline)}</text>
    <!-- feature chips -->
    <g transform="translate(0,348)">
      ${t.chips.map((c, i) => {
        const cw = 38 + c.length * 11.5;
        const cx = (i % 2) * 330;
        const cy = Math.floor(i / 2) * 64;
        return `<g transform="translate(${cx},${cy})">
          <rect x="0" y="0" width="${cw}" height="46" rx="23" fill="#ffffff" fill-opacity="0.06" stroke="${t.accent}" stroke-opacity="0.3"/>
          <circle cx="26" cy="23" r="6" fill="${t.accent}"/>
          <text x="44" y="29" font-family="${FONT}" font-size="18" fill="#ffffff" font-weight="600">${esc(c)}</text>
        </g>`;
      }).join("")}
    </g>
  </g>

  <!-- right: phones -->
  <g transform="translate(1015,120) rotate(-8 150 310)">
    ${phone(t, (tt, w, h) => appScreen(tt, w, h, t.screenA), { w: 300, h: 620 })}
  </g>
  <g transform="translate(1230,250) rotate(6 130 270)">
    ${phone(t, (tt, w, h) => appScreen(tt, w, h, t.screenB), { w: 260, h: 540 })}
  </g>
</svg>`;
}

/* ------------------------------ phone-only art --------------------------- */

function phoneArtSVG(t, screenOpts) {
  const W = 820, H = 1640;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.bg1}"/><stop offset="1" stop-color="${t.bg2}"/></linearGradient>
    <radialGradient id="glow1" cx="50%" cy="22%" r="60%"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.4"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
    <radialGradient id="glow2" cx="50%" cy="90%" r="60%"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0.35"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/></radialGradient>
    <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.accent}"/><stop offset="1" stop-color="${t.accent2}"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow1)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>
  <g transform="translate(90,160) scale(2.13)">
    ${phone(t, (tt, w, h) => appScreen(tt, w, h, screenOpts), { w: 300, h: 620 })}
  </g>
</svg>`;
}

/* --------------------------------- themes -------------------------------- */

const apps = {
  "university-smart-system": {
    brand: "THYNK UNLIMITED",
    name1: "University",
    name2: "Smart System",
    tagline: "AI-powered campus, end to end.",
    bg1: "#0a0a1f", bg2: "#10112e", accent: "#22d3ee", accent2: "#a855f7",
    chips: ["AI Tutor (GPT-4)", "Live Lectures", "Smart Exams", "Study Plans"],
    screenA: {
      eyebrow: "DASHBOARD", title: "Welcome back", cardTitle: "Live lecture starting",
      cardSub: "Data Structures · in 5 min", activeNav: 0,
      rows: [["AI Tutor", "Ask about your course", "GPT-4"], ["Smart Exam", "Algorithms · MCQ", "Open"], ["Study Plan", "Day 3 of 7", "60%"]],
    },
    screenB: {
      eyebrow: "AI TUTOR", title: "Explain mode", cardTitle: "RAG over course files",
      cardSub: "1,536-dim embeddings", activeNav: 1,
      rows: [["Quiz Generator", "Pick difficulty", "5–30"], ["Mastery", "Overall progress", "82%"]],
    },
  },
  "pet-haven": {
    brand: "PET HAVEN",
    name1: "Pet Haven",
    name2: "All-in-one",
    tagline: "Smart care for happy pets.",
    bg1: "#0b1418", bg2: "#0e2226", accent: "#2dd4bf", accent2: "#f59e0b",
    chips: ["Pet Store", "Vet Chat", "Grooming", "Pet Hotel"],
    screenA: {
      eyebrow: "PET HAVEN", title: "Hello, Luna", cardTitle: "Vet is online now",
      cardSub: "Live consultation chat", activeNav: 0,
      rows: [["Shop", "Food & supplies", "New"], ["Grooming", "Book a slot", "Sat"], ["Pet Hotel", "Reserve a stay", "→"]],
    },
    screenB: {
      eyebrow: "STORE", title: "Your cart", cardTitle: "Secure checkout",
      cardSub: "Stripe payments", activeNav: 2,
      rows: [["Premium food", "2 × bag", "$48"], ["Vitamins", "1 × pack", "$15"]],
    },
  },
  "pharmacy-assistant": {
    brand: "SMART CARE FOR BETTER HEALTH",
    name1: "Pharmacy",
    name2: "Assistant",
    tagline: "Your pharmacy, one tap away.",
    bg1: "#06140f", bg2: "#0a2018", accent: "#10b981", accent2: "#06b6d4",
    chips: ["Pharmacy Store", "Pharmacist Chat", "Secure Pay", "Order Tracking"],
    screenA: {
      eyebrow: "PHARMACY", title: "Good morning", cardTitle: "Talk to a pharmacist",
      cardSub: "Live consultation · 1 hr", activeNav: 0,
      rows: [["Browse medicines", "Search & filter", "24/7"], ["My order", "Out for delivery", "Track"], ["Health tips", "Daily wellness", "New"]],
    },
    screenB: {
      eyebrow: "CONSULT", title: "Pharmacist", cardTitle: "Verified & licensed",
      cardSub: "Real-time chat", activeNav: 1,
      rows: [["Prescription", "Upload & verify", "OK"], ["Payment", "Encrypted", "Safe"]],
    },
  },
};

/* --------------------------------- render -------------------------------- */

async function toWebp(svg, file, q = 80) {
  await sharp(Buffer.from(svg)).webp({ quality: q }).toFile(path.join(OUT, file));
  console.log("✓", `portfolio/${file}`);
}

async function main() {
  for (const [slug, t] of Object.entries(apps)) {
    await toWebp(coverSVG(t), `${slug}-cover.webp`, 82);
    await toWebp(phoneArtSVG(t, t.screenA), `${slug}-1.webp`);
    await toWebp(phoneArtSVG(t, t.screenB), `${slug}-2.webp`);
    await toWebp(phoneArtSVG(t, { ...t.screenA, ...t.screenC, activeNav: 3 }), `${slug}-3.webp`);
  }
  console.log("\n✓ Portfolio art generated.");
}

main().catch((e) => { console.error(e); process.exit(1); });
