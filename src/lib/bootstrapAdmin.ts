import type { Payload } from "payload";

/**
 * Bootstrap admin account.
 *
 * Ensures a professional, predictable admin login always exists — in both
 * development and production — without manual seeding. Runs from Payload's
 * `onInit` (see payload.config.ts) on every server start.
 *
 * It ONLY creates the account when it is missing, so any password you change
 * later in the admin dashboard is preserved across restarts and redeploys.
 *
 * The defaults are intentionally static/in-code so the login is the same
 * everywhere. Override per-environment with the ADMIN_EMAIL / ADMIN_PASSWORD
 * env vars if you ever need to. Change the password in the dashboard right
 * after the first sign-in.
 */
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@gccapp.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "GccApp@2026!";
const ADMIN_NAME = process.env.ADMIN_NAME || "GCC App Admin";

export async function ensureBootstrapAdmin(payload: Payload): Promise<void> {
  try {
    const existing = await payload.find({
      collection: "users",
      where: { email: { equals: ADMIN_EMAIL } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (existing.totalDocs > 0) return;

    await payload.create({
      collection: "users",
      data: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        name: ADMIN_NAME,
        roles: ["admin"],
      },
      overrideAccess: true,
    });
    payload.logger.info(`Bootstrap admin ensured: ${ADMIN_EMAIL}`);
  } catch (err) {
    // Best-effort: never block server startup on a seeding hiccup (e.g. a race
    // between concurrent instances both creating the same account — the unique
    // email index makes the loser's create fail harmlessly).
    payload.logger.warn(`Bootstrap admin setup skipped: ${String(err)}`);
  }
}
