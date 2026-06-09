# GCC App — Website

Premium digital agency website. Clean, modern **cyan / white** tech-services theme,
built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4**.

Light + soft dark mode, fluid typography (Space Grotesk + Inter), gentle motion
(Framer Motion + Lenis), full accessibility and SEO, and contact/career forms with
optional email (Resend) and spam protection (Turnstile).

---

## Run locally

```bash
# 1. Postgres (one-time, macOS/Homebrew)
brew install postgresql@16 && brew services start postgresql@16
createdb gccapp

# 2. App
npm install
cp .env.example .env         # set DATABASE_URI + PAYLOAD_SECRET (see file)
npm run dev                  # http://localhost:3000
npm run seed                 # creates admin user + seeds the Team collection
```

Admin dashboard: **http://localhost:3000/admin** (the seed creates
`admin@gccapp.com` / `ChangeMe123!` — change it after first login).

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

---

## Project structure

```
src/
  app/                 # routes (App Router)
    api/contact/       # form handler (email + spam check)
    services/[slug]/   # dynamic service pages
    portfolio/[slug]/  # dynamic project pages
    case-studies/[slug]/
    sitemap.ts, robots.ts
  components/
    layout/            # Header (mega-menu + mobile drawer), Footer
    sections/          # Hero, Process, Stats, ServicesGrid, CaseStudiesTabs, …
    ui/                # Button, Container, Section, cards, fields, primitives
    motion/            # Reveal (scroll fade-up), SmoothScroll (Lenis)
    forms/             # ContactForm, CareerForm
  content/             # ← ALL site content lives here (single source of truth)
  lib/                 # utils, env
public/media/          # images, video, svg
```

## Editing content

All copy and data live in **`src/content/`** — edit these files, no code changes needed:

| File | Controls |
|------|----------|
| `site.ts` | Name, contact, socials, nav menu, stats, process steps |
| `services.ts` | The 6 services (+ detail pages) |
| `projects.ts` | Portfolio projects (+ detail pages) |
| `caseStudies.ts` | Case studies (+ detail pages) |
| `faqs.ts` | FAQ questions by category |
| `careers.ts` | Open roles |

> Remaining collections (services, projects, etc.) are structured so they can move
> to Payload the same way the Team collection did — each page imports from
> `content/`, so only the data source changes.

## Team — managed in the Payload CMS

The **"Our People"** section is fully editable from the dashboard (no code):

- **Collection:** `src/collections/Team.ts` — name, role, "currently working on",
  bio, photo (upload → responsive sizes + square crop), department, socials, order,
  featured. Name/role/workingOn/bio are localized (EN/AR).
- **Frontend** reads from Payload via `src/lib/getTeam.ts` (server-only, with a seed
  fallback if the DB is unreachable). The grid + cards are in
  `components/sections/TeamGrid.tsx` and `components/ui/TeamCard.tsx`; the home
  variant is `components/sections/FeaturedTeam.tsx`.
- `/` and `/about` are dynamic, so **new people appear immediately — no redeploy.**

**To add a person:** go to `/admin` → **Team** → **Create New** → fill in name, role,
what they're working on, upload a photo, pick a department, set Order, tick "Feature
on home page" if wanted → **Save**. They appear on `/about` (and the home page if
featured) right away.

Other Payload collections: **Media** (uploads, alt text required) and **Users**
(admin/editor accounts).

## Media

Drop assets in `public/media/{images,video,svg}` and reference them by path
(e.g. `/media/images/10-portfolio-ecommerce.png`). Images use `next/image`
(AVIF/WebP, responsive); hero/section videos are muted, autoplay, `playsInline`
with a poster. Source prompts and a manifest are in `../media/`.

---

## Environment variables

See `.env.example`.

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URI` | **yes** | Postgres connection for Payload CMS |
| `PAYLOAD_SECRET` | **yes** | Signs Payload auth tokens |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URL, sitemap, OG tags |
| `RESEND_API_KEY` | optional | Enables contact/career email delivery |
| `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` | optional | Recipient + verified sender |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | optional | Cloudflare Turnstile spam protection |

**Without email configured**, form submissions are validated and logged to the
server console (and the user still sees a success state).

---

## Deploy to Vercel

1. **Provision Postgres** — create a managed database (Neon, Supabase, RDS) and copy
   its connection string. (Local Homebrew Postgres is dev-only.)
2. Push this repo to GitHub.
3. In Vercel: **New Project → import the repo**. Framework auto-detects as Next.js.
4. Add env vars under **Settings → Environment Variables**: `DATABASE_URI` (the
   Neon string), `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`, plus optional email/spam keys.
5. **Deploy.** First boot pushes the Payload schema to the database. Then run
   `npm run seed` (or create your admin user at `/admin`) once.
6. Add your custom domain under **Settings → Domains**.

> **Media note:** uploads are stored on local disk (`public/media/uploads`). On
> serverless hosts like Vercel that filesystem is ephemeral — for production, point
> the `media` collection at object storage (`@payloadcms/storage-s3` / Vercel Blob).

For email in production, verify your sending domain in Resend and set
`CONTACT_FROM_EMAIL` to an address on that domain.

---

## Quality notes

- **Accessibility:** semantic landmarks, skip link, keyboard-navigable menus,
  ARIA on accordions/menus, AA-minded contrast, full `prefers-reduced-motion`.
- **SEO:** per-page metadata, OpenGraph/Twitter cards, Organization + WebSite
  JSON-LD, `sitemap.xml`, `robots.txt`.
- **Performance:** static prerendering, `next/image`, lazy video, code-split
  client components, security headers in `next.config.ts`.
