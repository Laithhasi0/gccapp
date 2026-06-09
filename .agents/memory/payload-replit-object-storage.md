---
name: Payload media on Replit Object Storage
description: How persistent media uploads are wired for the Payload CMS on Replit, and why
---

# Persistent media uploads (Payload + Replit Object Storage)

On Replit Autoscale deployments the filesystem is ephemeral and multi-instance, so
Payload's default on-disk upload `staticDir` (`public/media/uploads`) loses every
uploaded image on redeploy. Media must go to Object Storage to persist in production.

**Why a custom adapter:** Replit Object Storage is GCS-based with its own SDK
(`@replit/object-storage`), NOT S3-compatible — so `@payloadcms/storage-s3` does not
work. We use `@payloadcms/plugin-cloud-storage` with a hand-written adapter
(`src/lib/objectStorage.ts`) that uploads/downloads via the SDK `Client` and serves
files through Payload's own `/api/<collection>/file/<filename>` route (bucket is private).

**How to apply:**
- The plugin is only added when `OBJECT_STORAGE_ENABLED === "true"` (shared env var).
  Without it, dev keeps using the local `staticDir` — so the app still boots with no bucket.
- A bucket must be created manually via the workspace Object Storage tool (cannot be done
  programmatically; `.replit` edits are blocked). The no-arg `new Client()` then uses the
  repl's default bucket.
- `downloadAsBytes` returns `Result<[Buffer]>` — the value is a one-element tuple, read `value[0]`.
- After creating the bucket, set `OBJECT_STORAGE_ENABLED=true` and re-upload existing images
  (old local-disk files are not migrated automatically).
