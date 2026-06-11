"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Languages } from "lucide-react";
import { dir, LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { useI18n } from "./LocaleProvider";

/** Header toggle that flips between Arabic and English and persists the choice. */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const next: Locale = locale === "ar" ? "en" : "ar";

  function switchTo() {
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
    document.documentElement.lang = next;
    document.documentElement.dir = dir(next);
    startTransition(() => router.refresh());
  }

  return (
    <button
      type="button"
      onClick={switchTo}
      disabled={isPending}
      aria-label={t.lang.label}
      className={`inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-60 ${className}`}
    >
      <Languages className="h-4 w-4" strokeWidth={1.75} />
      {t.lang.toggleTo}
    </button>
  );
}
