"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Label, Input, Textarea, Select } from "@/components/ui/Field";
import { useI18n } from "@/components/i18n/LocaleProvider";

type Status = "idle" | "loading" | "success" | "error";

export function CareerForm({ roleOptions = [] }: { roleOptions?: string[] }) {
  const { t } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("company_website")) {
      setStatus("success");
      form.reset();
      return;
    }
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      service: `${t.form.careerApplication}: ${fd.get("role")}`,
      message: `${t.form.applyingFor}: ${fd.get("role")}\n${t.form.portfolioLinkedin}: ${fd.get("link") || "—"}\n\n${fd.get("message")}`,
      company_website: fd.get("company_website"),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || t.form.errorGeneric);
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
        <p className="font-display text-lg font-semibold text-ink">
          {t.form.applicationReceived}
        </p>
        <p className="mt-1 text-sm text-muted">
          {t.form.applicationReceivedBody}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-name">{t.form.name}</Label>
          <Input id="c-name" name="name" required autoComplete="name" placeholder={t.form.yourNamePh} />
        </div>
        <div>
          <Label htmlFor="c-email">{t.form.email}</Label>
          <Input id="c-email" name="email" type="email" required autoComplete="email" placeholder={t.form.emailPersonalPh} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-role">{t.form.role}</Label>
          <Select id="c-role" name="role" defaultValue={roleOptions[0] ?? ""}>
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="c-link">{t.form.portfolioLinkedin}</Label>
          <Input id="c-link" name="link" placeholder={t.form.linkPh} />
        </div>
      </div>
      <div>
        <Label htmlFor="c-message">{t.form.whyYou}</Label>
        <Textarea id="c-message" name="message" required placeholder={t.form.whyYouPh} />
      </div>
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
        {status === "loading" ? t.form.sending : t.form.submitApplication}
      </Button>
    </form>
  );
}
