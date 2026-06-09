import path from "path";
import { Pool } from "pg";
import type {
  Adapter,
  GeneratedAdapter,
} from "@payloadcms/plugin-cloud-storage/types";

/**
 * Payload cloud-storage adapter that stores uploaded media as rows in Postgres.
 *
 * The Replit-managed Postgres database is persistent across deploys, whereas the
 * default on-disk `staticDir` is wiped on every Autoscale redeploy. Storing the
 * (small, resized WebP) image bytes in the DB keeps uploads permanent with zero
 * manual setup — no Object Storage bucket required.
 *
 * Files are served through Payload's own `/api/<collection>/file/<filename>` route
 * via `staticHandler` (the bytes never leave the DB to disk).
 */

let pool: Pool | null = null;
let ready: Promise<void> | null = null;

const getPool = (): Pool => {
  if (!pool) {
    const connectionString =
      process.env.DATABASE_URI || process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("postgresStorage: DATABASE_URL is not set");
    }
    // Keep this footprint small: this pool is in addition to Payload's own DB
    // pool, and Autoscale can run many instances. Release idle connections so the
    // steady-state connection count stays low.
    pool = new Pool({
      connectionString,
      max: 2,
      idleTimeoutMillis: 30000,
      allowExitOnIdle: true,
    });
  }
  return pool;
};

const ensureTable = (): Promise<void> => {
  if (!ready) {
    ready = getPool()
      .query(
        `CREATE TABLE IF NOT EXISTS media_blobs (
           key         TEXT PRIMARY KEY,
           data        BYTEA NOT NULL,
           mime_type   TEXT NOT NULL,
           updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
         )`,
      )
      .then(() => undefined)
      .catch((err) => {
        // Reset so a later request can retry table creation.
        ready = null;
        throw err;
      });
  }
  return ready;
};

const keyFor = (prefix: string | undefined, filename: string): string =>
  prefix ? path.posix.join(prefix, filename) : filename;

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

export const postgresStorageAdapter = (): Adapter => {
  return ({ collection }): GeneratedAdapter => {
    return {
      name: "postgres-media",

      generateURL: ({ filename }) =>
        `/api/${collection.slug}/file/${encodeURIComponent(filename)}`,

      handleUpload: async ({ data, file }) => {
        await ensureTable();
        const key = keyFor(data?.prefix as string | undefined, file.filename);
        await getPool().query(
          `INSERT INTO media_blobs (key, data, mime_type, updated_at)
             VALUES ($1, $2, $3, now())
           ON CONFLICT (key) DO UPDATE
             SET data = EXCLUDED.data,
                 mime_type = EXCLUDED.mime_type,
                 updated_at = now()`,
          [key, file.buffer, file.mimeType],
        );
      },

      handleDelete: async ({ doc, filename }) => {
        await ensureTable();
        const key = keyFor(doc?.prefix, filename);
        await getPool().query(`DELETE FROM media_blobs WHERE key = $1`, [key]);
      },

      staticHandler: async (_req, { params }) => {
        await ensureTable();
        const key = keyFor(params.prefix, params.filename);
        const result = await getPool().query<{
          data: Buffer;
          mime_type: string;
        }>(`SELECT data, mime_type FROM media_blobs WHERE key = $1`, [key]);

        const row = result.rows[0];
        if (!row) {
          return new Response("Not found", { status: 404 });
        }
        const ext = path.extname(params.filename).toLowerCase();
        const contentType =
          row.mime_type || MIME_BY_EXT[ext] || "application/octet-stream";
        return new Response(new Uint8Array(row.data), {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Content-Length": String(row.data.length),
            // Not `immutable`: a re-upload can replace bytes under the same
            // filename, so allow revalidation rather than caching forever.
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    };
  };
};
