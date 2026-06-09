import path from "path";
import { Client } from "@replit/object-storage";
import type {
  Adapter,
  GeneratedAdapter,
} from "@payloadcms/plugin-cloud-storage/types";

/**
 * Custom Payload cloud-storage adapter backed by Replit Object Storage.
 *
 * Replit Object Storage is GCS-based and uses its own SDK (`@replit/object-storage`),
 * so it is NOT S3-compatible and can't use `@payloadcms/storage-s3`. This adapter
 * streams uploads/downloads through the SDK and serves files via Payload's own
 * `/api/<collection>/file/<filename>` route (the bucket is private).
 *
 * Activated only when `OBJECT_STORAGE_ENABLED` is set (see payload.config.ts), so
 * local dev without a bucket keeps using the on-disk `staticDir`.
 */

let cached: Client | null = null;
const getClient = (): Client => {
  // No-arg client uses the repl's default bucket (configured in .replit once a
  // bucket is created via the workspace Object Storage tool).
  if (!cached) cached = new Client();
  return cached;
};

const keyFor = (prefix: string | undefined, filename: string): string =>
  prefix ? path.posix.join(prefix, filename) : filename;

export const replitObjectStorageAdapter = (): Adapter => {
  return ({ collection }): GeneratedAdapter => {
    return {
      name: "replit-object-storage",

      generateURL: ({ filename }) =>
        `/api/${collection.slug}/file/${encodeURIComponent(filename)}`,

      handleUpload: async ({ data, file }) => {
        const key = keyFor(data?.prefix as string | undefined, file.filename);
        const res = await getClient().uploadFromBytes(key, file.buffer, {
          compress: false,
        });
        if (!res.ok) {
          throw new Error(
            `Object storage upload failed for "${key}": ${String(res.error)}`,
          );
        }
      },

      handleDelete: async ({ doc, filename }) => {
        const key = keyFor(doc?.prefix, filename);
        const res = await getClient().delete(key, { ignoreNotFound: true });
        if (!res.ok) {
          throw new Error(
            `Object storage delete failed for "${key}": ${String(res.error)}`,
          );
        }
      },

      staticHandler: async (_req, { params }) => {
        const key = keyFor(params.prefix, params.filename);
        const res = await getClient().downloadAsBytes(key);
        if (!res.ok) {
          return new Response("Not found", { status: 404 });
        }
        const buffer = res.value[0];
        const ext = path.extname(params.filename).toLowerCase();
        const contentType = MIME_BY_EXT[ext] ?? "application/octet-stream";
        return new Response(new Uint8Array(buffer), {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Content-Length": String(buffer.length),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    };
  };
};

const MIME_BY_EXT: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
};
