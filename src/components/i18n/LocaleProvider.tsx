"use client";

import { createContext, useContext } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import { dir } from "@/lib/i18n";

type I18nValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  t: Dict;
};

const I18nContext = createContext<I18nValue | null>(null);

export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Dict;
  children: React.ReactNode;
}) {
  const value: I18nValue = { locale, dir: dir(locale), t: messages };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Access the active locale, direction and UI dictionary in client components. */
export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within a LocaleProvider");
  }
  return ctx;
}
