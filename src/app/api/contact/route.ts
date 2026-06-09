import { NextResponse } from "next/server";
import { env, isEmailConfigured, isTurnstileConfigured } from "@/lib/env";

export const runtime = "nodejs";

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  service?: string;
  message?: string;
  company_website?: string; // honeypot
  "cf-turnstile-response"?: string;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function verifyTurnstile(token: string | undefined, ip: string | null) {
  if (!isTurnstileConfigured) return true; // skip when not configured
  if (!token) return false;
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: env.turnstileSecret!,
          response: token,
          ...(ip ? { remoteip: ip } : {}),
        }),
      },
    );
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

async function sendEmails(p: ContactPayload) {
  if (!isEmailConfigured) {
    console.info("[contact] Email not configured — submission logged:", {
      name: p.name,
      email: p.email,
      service: p.service,
    });
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(env.resendApiKey);

  const adminHtml = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(p.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(p.email)}</p>
    <p><strong>Company:</strong> ${escapeHtml(p.company) || "—"}</p>
    <p><strong>Service:</strong> ${escapeHtml(p.service) || "—"}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(p.message).replace(/\n/g, "<br/>")}</p>
  `;

  await resend.emails.send({
    from: env.contactFromEmail,
    to: env.contactToEmail,
    replyTo: p.email,
    subject: `New enquiry from ${p.name || "website"}`,
    html: adminHtml,
  });

  // Auto-reply to sender
  await resend.emails.send({
    from: env.contactFromEmail,
    to: p.email!,
    subject: "We've received your message — GCC App",
    html: `<p>Hi ${escapeHtml(p.name) || "there"},</p>
      <p>Thanks for reaching out to GCC App. We've received your message and will get back to you within one business day.</p>
      <p>— The GCC App team</p>`,
  });
}

function escapeHtml(s?: string) {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot
  if (body.company_website) {
    return NextResponse.json({ ok: true });
  }

  if (!body.name || !body.email || !emailRe.test(body.email) || !body.message) {
    return NextResponse.json(
      { error: "Please provide your name, a valid email and a message." },
      { status: 422 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const human = await verifyTurnstile(body["cf-turnstile-response"], ip);
  if (!human) {
    return NextResponse.json(
      { error: "Spam check failed. Please try again." },
      { status: 403 },
    );
  }

  try {
    await sendEmails(body);
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json(
      { error: "We couldn't send your message. Please email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
