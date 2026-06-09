"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Label, Input, Textarea, Select } from "@/components/ui/Field";
import { careers } from "@/content/careers";

type Status = "idle" | "loading" | "success" | "error";

export function CareerForm() {
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
      service: `Career application: ${fd.get("role")}`,
      message: `Applying for: ${fd.get("role")}\nLinkedIn/Portfolio: ${fd.get("link") || "—"}\n\n${fd.get("message")}`,
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
        throw new Error(b.error || "Something went wrong.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius)] border border-accent/30 bg-accent-soft p-6 text-center">
        <p className="font-display text-lg font-semibold text-ink">
          Application received!
        </p>
        <p className="mt-1 text-sm text-muted">
          Thanks for applying. We&apos;ll be in touch if there&apos;s a fit.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-name">Name</Label>
          <Input id="c-name" name="name" required autoComplete="name" placeholder="Your name" />
        </div>
        <div>
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" name="email" type="email" required autoComplete="email" placeholder="you@email.com" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-role">Role</Label>
          <Select id="c-role" name="role" defaultValue={careers[0].role}>
            {careers.map((c) => (
              <option key={c.slug} value={c.role}>
                {c.role}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="c-link">Portfolio / LinkedIn</Label>
          <Input id="c-link" name="link" placeholder="https://…" />
        </div>
      </div>
      <div>
        <Label htmlFor="c-message">Why you?</Label>
        <Textarea id="c-message" name="message" required placeholder="Tell us a little about yourself…" />
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
        {status === "loading" ? "Sending…" : "Submit application"}
      </Button>
    </form>
  );
}
