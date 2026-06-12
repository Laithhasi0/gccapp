---
name: Bilingual content fallbacks (do NOT run the English seed)
description: Why scripts/seed.mjs must not be run on this Arabic-default bilingual site, and how DB-vs-inline fallback works per locale.
---

- The site is bilingual with `defaultLocale = "ar"`. `src/lib/cms.ts` queries each collection/global for the request locale and **only** falls back to inline bilingual content (`@/content/ar.ts` for `ar`, the `@/content/*` seed for `en`) when the DB returns **zero** rows for that collection.

- **Do NOT run `scripts/seed.mjs` on this site.** Its data arrays are English-only and it writes via REST without `?locale`, so every row lands in the `ar` default locale (and the empty `en` locale then itself falls back to those Arabic-locale rows). Result: English text appears on the Arabic site and the inline bilingual fallbacks stop being used.

**Why:** the intended architecture keeps the content collections empty in the DB and renders both languages from the inline `@/content` defaults. Populating the DB English-only silently breaks Arabic.

**How to apply:** to put real content in the DB you must write **both** locales per document (POST default `ar` text, then PATCH with `?locale=en` for English). The home page is the exception and is handled automatically — the `/editor` first save migrates the home into the `home-page` global and backfills the other locale from its own defaults (`saveHomeSections` in `src/lib/homePage.ts`).
