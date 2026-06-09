/** Centralised, typed access to optional integration env vars. */
export const env = {
  resendApiKey: process.env.RESEND_API_KEY,
  contactToEmail: process.env.CONTACT_TO_EMAIL || "info@gccapp.com",
  contactFromEmail:
    process.env.CONTACT_FROM_EMAIL || "GCC App <onboarding@resend.dev>",
  turnstileSecret: process.env.TURNSTILE_SECRET_KEY,
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
};

export const isEmailConfigured = Boolean(env.resendApiKey);
export const isTurnstileConfigured = Boolean(env.turnstileSecret);
