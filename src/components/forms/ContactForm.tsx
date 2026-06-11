"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Label, Input, Textarea, Select } from "@/components/ui/Field";
import { useI18n } from "@/components/i18n/LocaleProvider";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm({
  compact = false,
  serviceOptions = [],
}: {
  compact?: boolean;
  serviceOptions?: string[];
}) {
  const { t } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Honeypot — bots fill this hidden field.
    if (data.company_website) {
      setStatus("success");
      form.reset();
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || t.form.errorGeneric);
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : t.form.errorGeneric);
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius)] border border-accent/30 bg-accent-soft p-6 text-center">
        <p className="font-display text-lg font-semibold text-ink">{t.form.thankYou}</p>
        <p className="mt-1 text-sm text-muted">
          {t.form.thankYouBody}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-accent hover:underline"
        >
          {t.form.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">{t.form.name}</Label>
          <Input id="name" name="name" required autoComplete="name" placeholder={t.form.yourNamePh} />
        </div>
        <div>
          <Label htmlFor="email">{t.form.email}</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" placeholder={t.form.emailCompanyPh} />
        </div>
      </div>

      {!compact && (
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="company">{t.form.company}</Label>
            <Input id="company" name="company" autoComplete="organization" placeholder={t.form.companyPh} />
          </div>
          <div>
            <Label htmlFor="service">{t.form.serviceOfInterest}</Label>
            <Select id="service" name="service" defaultValue="">
              <option value="" disabled>
                {t.form.selectService}
              </option>
              {serviceOptions.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
              <option value="Other">{t.form.other}</option>
            </Select>
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="message">{t.form.message}</Label>
        <Textarea id="message" name="message" required placeholder={t.form.messagePh} />
      </div>

      {/* Honeypot field — visually hidden */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label>
          Company website
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? t.form.sending : t.form.send}
      </Button>
    </form>
  );
}
