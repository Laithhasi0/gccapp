"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";

/** Friendly back-to-top button that appears after scrolling down. */
export function ScrollToTop() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toTop() {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={t.a11y.backToTop}
      className={`fixed bottom-6 right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-contrast shadow-lg transition-all duration-300 ease-soft hover:bg-accent-hover ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
