---
name: Bilingual seed-fallback architecture (GCC App)
description: How Arabic-default + English bilingual is layered on a site whose DB is empty and renders from seed/inline defaults.
---

# Bilingual where the DB is empty

The GCC App renders from seed content + inline component defaults because the Payload DB is empty. So bilingual coverage cannot rely on CMS-stored translations alone — every seed/inline default must have a locale-aware path.

**Pattern:**
- Pure dict lives in `src/lib/i18n.ts`: `const en = {...}`, `type Dict = typeof en`, `const ar: Dict = {...}`. Because `ar` is typed `Dict`, any missing key is a compile error — this is the safety net keeping the two locales in sync.
- Arabic content (services/projects/case studies/faqs/careers/team/globals) lives in `src/content/ar.ts`.
- Server: `getUI(await getLocale())` — `getLocale` is async, reads the `NEXT_LOCALE` cookie; `defaultLocale = "ar"` (RTL).
- Client: `useI18n()` from `LocaleProvider`.
- `cms.ts` / `getTeam.ts` return locale-aware data (`isAr(locale) ? *Ar : seed*`).

**Display vs. internal values:** filter/category/department/role VALUES stay English internally for stable keys; only the displayed label is translated via `t.categories[c] ?? c`, `t.departments[c] ?? c`. Team departments are intentionally English in both locales.

**Form options:** client forms (ContactForm, CareerForm) receive localized option arrays as props from their async server parents (via `getServices()` / `getCareers()`), rather than importing English seed arrays directly.

**Out of scope (by task definition):** more languages, /ar /en URL routing, page metadata (`<title>`/description left English), human proofreading.
