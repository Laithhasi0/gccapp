# GCC App Rebuild — Roadmap + Detailed Prompts (Cyan / White Tech Theme)

Do the phases **in order**. Each phase has a full, ready-to-paste Claude Code prompt. Finish and
review one phase before pasting the next.

**Theme for the whole project: clean, modern tech-services look — CYAN + WHITE, comfortable on the
eyes.** Soft off-white (not harsh pure white), a calm professional cyan accent (not neon), airy
whitespace, modern sans-serif type, and gentle motion. Polish comes from clarity, spacing, and
comfortable contrast — not glow or flashy effects.

---

## PHASE 0 — DECISIONS & CONTENT (no code yet — do this first)

**Decide:**
- Confirm the cyan accent. Default `#129EB4` (comfortable cyan). Want it bluer? `#0EA5C4`. Greener/teal? `#12A89B`.
- Light only, or light + a soft dark mode (deep slate-teal, not black).
- English-first now, Arabic added in Phase 9 (recommended), or both from day one.

**Gather (put in a folder):**
- Logo as **SVG** (vectorize the current PNG with vectorizer.ai or recraft.ai).
- Real contact info: phone, email (info@gccapp.com), real address.
- Real content: portfolio projects, services copy, team names/roles/photos, FAQ Q&As, stats.
- Fonts: modern tech sans for display (Space Grotesk / General Sans — free) + body sans (Inter / Geist —
  free); Arabic font for later (IBM Plex Sans Arabic / Cairo).

**Create accounts (free tiers):** Neon (Postgres), Resend (email), Vercel (hosting),
Cloudflare Turnstile (spam).

---

## PHASE 1 — SCAFFOLD + DESIGN SYSTEM

**Paste into Claude Code (empty folder):**

> You are my senior frontend engineer. Start a new website for **GCC App**, a premium digital agency
> (mobile apps, web apps, e-commerce, branding, marketing, SEO). The look is a **clean modern
> tech-services aesthetic in CYAN + WHITE, comfortable on the eyes — NOT neon, NOT glowy, NOT dark
> sci-fi.** Soft off-white backgrounds, a calm professional cyan accent, airy whitespace, crisp modern
> sans-serif type, gentle motion. Quality comes from clarity, spacing and comfortable contrast.
>
> **Stack:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4. Set up the project,
> ESLint/Prettier, and a clean folder structure (`app/`, `components/`, `lib/`, `styles/`).
>
> **Design tokens (CSS variables in a global stylesheet):**
> - Background `#F5F9FB` (soft cool off-white, easy on eyes), surface `#FFFFFF`, subtle section tint `#E3F3F6`
> - Ink text `#15262B` (deep slate-teal, never pure black), muted text `#5C6B70`, hairline border `#DDE8EB`
> - Accent cyan `[#129EB4]` (swap if I change my mind), accent-hover `#0E8092`, accent-soft tint `#E3F3F6`
> - Optional soft dark mode: bg `#0E1A1E` (deep slate-teal, not black), surface `#16262B`, text `#EAF4F6`, accent cyan unchanged
> - Radius 12–20px; soft, slightly cool-tinted shadows (low opacity, large blur); thin hairline borders
> - Generous spacing scale; max content width ~1200px; 12-col grid
>
> **Typography:** load with `next/font`, `display: swap`. Display = a modern tech sans (Space Grotesk or
> General Sans). Body = a clean sans (Inter or Geist). Airy type scale, fluid `clamp()` sizes, body
> line-height 1.5–1.7. Comfortable, not cramped.
>
> **Motion baseline (subtle):** ease `cubic-bezier(0.22, 1, 0.36, 1)`, durations 0.5–0.8s, fade-up
> reveals (16–24px), gentle hover (scale 1.01 + soft shadow). Fully honor `prefers-reduced-motion`.
>
> Build a base layout shell (empty header/footer placeholders + `<main>`), a token/typography test page
> showing all colors, headings and buttons, and `Button`, `Container`, `Section` primitives. Mobile-first
> and responsive. Show me how to run it locally.

---

## PHASE 2 — CMS / DASHBOARD (the "control everything like WordPress" part)

**Paste into Claude Code:**

> Add **Payload CMS 3** embedded in this same Next.js app — the client's WordPress-style admin dashboard.
> Database: **Postgres via Neon** (I'll provide the connection string). Media uploads via Payload with
> responsive sizes + required alt text.
>
> Collections (clean admin grouping, friendly labels):
> - `pages` — block layout builder: Hero, RichText, Services, Stats, Team, Projects, CaseStudies, FAQ, MediaBlock, CTA.
> - `services` — title, slug, excerpt, body, icon/image, gallery, SEO.
> - `portfolio` — title, slug, category, client, year, cover image, cover video (optional), gallery,
>   challenge/solution/result, SEO.
> - `caseStudies` — title, slug, summary, metrics (repeatable), content sections, media.
> - `team` — name, role, photo, socials.
> - `faqs` — question, answer, category.
> - `careers` — role, location, type, description.
> - `formSubmissions` — read-only capture of contact + career forms.
> - `media` — uploads with alt text.
>
> Globals: `siteSettings` (logo, contact, socials, accent color), `header` (nav + dropdowns + CTA),
> `footer`, `seoDefaults`. Enable **localization** on all text fields for English + Arabic (fields exist
> now, Arabic filled later). Roles: `admin` (full), `editor` (content only).
>
> **Seed** the database with the real GCC App content I provide (6 services, portfolio projects, stats,
> FAQ) so the dashboard isn't empty. Confirm the admin panel runs and give me the URL.

---

## PHASE 3 — GLOBAL HEADER, FOOTER & SHARED COMPONENTS

**Paste into Claude Code:**

> Build the global chrome from the `header`, `footer`, `siteSettings` globals, in the cyan/white system.
>
> **Header:** sticky, slim, on soft off-white; a hairline bottom border + subtle shadow appear on scroll.
> Logo left; nav (Home, About, Portfolio, Services, FAQ, Contact). Portfolio and Services open clean
> mega-menu panels (soft fade/slide, generous padding, small preview thumbnails, cyan hover underline —
> no glow). Right: phone number + a solid cyan "Contact Us" button. Language switch EN/AR placeholder.
> Full mobile drawer, smooth open/close, keyboard accessible, ARIA on menus.
>
> **Footer:** about blurb, quick links, contact (info@gccapp.com, phone, Riyadh), social icons
> (lucide-react), copyright. Spacious, multi-column → stacked on mobile.
>
> **Shared components:** `AnimatedHeading` (gentle reveal), `StatCounter`, `ServiceCard` (white card,
> soft shadow, cyan icon), `ProjectCard` (subtle hover lift ≤2deg + soft shadow), `TeamCard`, `FAQItem`
> (accessible accordion), `Marquee` (slow, optional), `CTASection` (cyan band or cyan-tint), form
> `Input`/`Textarea`/`Select` (cyan focus ring), `Badge`. All responsive and reduced-motion safe.

---

## PHASE 4 — HOME PAGE

**Paste into Claude Code:**

> Build the **Home page** with the shared components, clean and spacious in cyan/white. Sections:
> 1. **Hero** — bold modern-sans headline + supporting line + two buttons (solid cyan + ghost). Light,
>    airy background image or muted video on soft off-white (poster + lazy; media added later). Gentle fade-up.
> 2. **Process** — Consultation → Planning → Design → Development → Testing → Launch, clean stepped layout
>    with cyan step accents (gentle sequential reveal).
> 3. **Services** — 6 cards (Mobile App, Web Design, E-Commerce, Branding, Digital Marketing, SEO):
>    white cards, soft shadow, cyan icon, hover lift.
> 4. **Case studies** — tabbed/sectioned showcase (Development, WooCommerce, CRM, Web Design, IT Support).
> 5. **Stats** — 150+ projects, 120+ clients, 98% satisfaction, 24/7, count-up on scroll, cyan numbers.
> 6. **Featured projects** — portfolio grid, subtle hover.
> 7. **CTA** — calm full-width cyan (or cyan-tint) band.
> 8. **Contact teaser** — short form + office info.
>
> Wire each section to the CMS. Mobile-first. Keep contrast comfortable and accessible (AA), cyan used as
> accent (buttons, icons, links, highlights) over a mostly white/off-white canvas.

---

## PHASE 5 — MOTION LAYER (smooth scroll + gentle reveals + ONE 3D moment)

**Paste into Claude Code:**

> Add a calm, performant motion layer.
> - Integrate **Lenis** for smooth scrolling.
> - **GSAP + ScrollTrigger** for soft fade-up/parallax reveals on sections and images (parallax ≤8%).
> - **Framer Motion** for small UI transitions (menu, hover, page transitions).
> - Exactly **ONE tasteful 3D moment** (React Three Fiber + drei): a slow, elegant scroll-reactive object
>   in a single hero/feature section — clean **matte white/light-grey material with a subtle cyan accent**,
>   soft studio lighting, NO glow. Lazy-load and code-split; provide a static image fallback for low-power
>   devices and when `prefers-reduced-motion` is set.
> - Confirm nothing 3D or GSAP is in the initial JS bundle (dynamic imports). Keep it smooth at 60fps.

---

## PHASE 6 — INNER PAGES

**Paste into Claude Code:**

> Build the remaining pages, all CMS-driven, consistent cyan/white system:
> - **About** — intro, stats, "why us", team grid.
> - **Services** listing + **`/services/[slug]`** detail.
> - **Portfolio** — filterable grid (category) + **`/portfolio/[slug]`** detail (cover, gallery,
>   challenge/solution/result, next-project link).
> - **Case Studies** listing + **`/case-studies/[slug]`**.
> - **FAQ** — accessible accordion by category.
> - **Careers** — roles + application form.
> - **Contact** — full form, office info, map.
> - **404** + legal (Privacy, Terms).
> Per-page metadata. Gentle transitions, spacious responsive layouts.

---

## PHASE 7 — FORMS, EMAIL & SPAM PROTECTION

**Paste into Claude Code:**

> Wire contact + careers forms: validate client + server side, save to `formSubmissions`, send email via
> **Resend** (key provided) to info@gccapp.com plus an auto-reply to the sender. Add **Cloudflare
> Turnstile** (keys provided) and a honeypot. Cyan focus states and clear success/error states. Works in
> EN and AR later.

---

## PHASE 8 — MEDIA, PERFORMANCE, ACCESSIBILITY & SEO

**Paste into Claude Code:**

> Final quality pass.
> - I'll drop media into `/public/media`. Wire hero/section videos (muted, autoplay, playsInline, poster,
>   pause-when-offscreen) and images via `next/image` (AVIF/WebP, responsive).
> - Performance: lazy + small videos, fonts subset, code-split heavy bits.
> - **Lighthouse mobile**: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. LCP <2.5s,
>   CLS <0.1, INP <200ms. Fix gaps.
> - Accessibility: semantic HTML, focus states, ARIA, **AA contrast (check cyan on white meets contrast)**,
>   keyboard nav, reduced-motion.
> - SEO: per-page metadata, OG/Twitter cards, JSON-LD (Organization, Breadcrumb), sitemap.xml, robots.txt.
>   Report scores.

---

## PHASE 9 — ARABIC / RTL

**Paste into Claude Code:**

> Add Arabic with correct **RTL**. `/ar` routing, `dir="rtl"`, load the Arabic font (IBM Plex Sans Arabic
> / Cairo), pull Arabic from Payload localized fields, language switcher, `hreflang`. Verify no RTL layout
> breaks (menus, grids, forms, flipped icons).

---

## PHASE 10 — DEPLOY

**Paste into Claude Code:**

> Prepare production on **Vercel** + Neon. Env vars, build config, image domains, and a `README` covering:
> run locally, deploy, how the client edits content in Payload, and where to add media. Walk me through
> deploy step by step.

---

## TIMELINE GUIDANCE
- Phases 1–3: foundation — get solid before visuals.
- Phases 4–6: the bulk of the visible site.
- Phases 5 + 8: where it becomes premium — don't rush.
- Generate Higgsfield media between Phase 4 and Phase 8 (see the media-prompts file).
