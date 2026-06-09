---
name: Payload media on Replit Object Storage
description: How persistent media uploads are wired for the Payload CMS on Replit, and why
---

# Persistent media uploads (Payload + Replit Object Storage)

On Replit Autoscale deployments the filesystem is ephemeral and multi-instance, so
Payload's default on-disk upload `staticDir` (`public/media/uploads`) loses every
uploaded image on redeploy. Media must go to Object Storage to persist in production.

**Default = Postgres blob storage (zero setup).** A bucket can ONLY be created via the
workspace Object Storage UI (no agent tool; `.replit` edits blocked; the
`javascript_object_storage` blueprint is not available in this env). To avoid blocking
on that manual step, the default media adapter (`src/lib/postgresStorage.ts`) stores
the (small, resized WebP) image bytes as BYTEA rows in the already-persistent
Replit Postgres DB via `@payloadcms/plugin-cloud-storage`. Files serve through
Payload's own `/api/<collection>/file/<filename>` route. `disableLocalStorage: true`,
`prefix: "media"`. Verified roundtrip (upload→serve→404→delete) against the real DB.

**Optional upgrade = Object Storage.** `src/lib/objectStorage.ts` is a GCS-SDK adapter
(`@replit/object-storage`) — Replit OS is GCS-based, NOT S3-compatible, so
`@payloadcms/storage-s3` does not work. It activates only when
`OBJECT_STORAGE_ENABLED === "true"` (after a bucket exists). `downloadAsBytes` returns
`Result<[Buffer]>` — a one-element tuple, read `value[0]`. `new Client()` uses the
repl's default bucket.

**Gotchas:**
- Don't mark served files `Cache-Control: immutable` — a re-upload can replace bytes
  under the same filename; use a moderate `max-age` so revalidation can happen.
- The pg `Pool` in postgresStorage.ts is SEPARATE from Payload's DB pool; keep it small
  (`max: 2`, `idleTimeoutMillis`, `allowExitOnIdle`) so Autoscale multi-instance doesn't
  exhaust DB connections.
- Switching adapters does not migrate existing files between backends.
