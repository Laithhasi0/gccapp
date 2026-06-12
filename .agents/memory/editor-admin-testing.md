---
name: Testing the Visual Editor / creating the first admin
description: How to create the first CMS user and exercise the /editor save flow when verifying this Payload app.
---

- **First admin user:** `POST /api/users/first-register` (plain `POST /api/users` is blocked — the `Users` collection only overrides `read` access, so `create` falls back to the default that requires an already-logged-in user). The editor API authenticates either the `payload-token` cookie or an `Authorization: JWT <token>` header.

- **server-only data layers can't be unit-tested standalone:** `src/lib/cms.ts` and `src/lib/homePage.ts` begin with `import "server-only"`, which throws in a plain node / `payload run` / tsx script (no `react-server` import condition). Exercise `saveHomeSections`/`loadHomeSections` through the HTTP editor API (`GET`/`POST /api/editor/home`) instead, which runs in the Next.js server context.

- **First-save migration is identical-by-design:** the `/editor` first save migrates the inline home defaults into the `home-page` global; the visible page text is byte-for-byte unchanged before/after in both locales (only internal RSC chunk ids / section UUIDs change).

- **Object Storage vs Postgres media:** media uploads use the Replit Object Storage bucket only when `OBJECT_STORAGE_ENABLED` is set AND a bucket exists in `.replit`; otherwise `src/lib/postgresStorage.ts` stores bytes in the `media_blobs` table (served via `/api/media/file/<filename>`). Never set `OBJECT_STORAGE_ENABLED=true` before a bucket exists — `new Client()` throws "A bucket name is needed".
