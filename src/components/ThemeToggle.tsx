"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

/** Minimal class-based dark-mode toggle for verifying tokens in both themes. */
export function ThemeToggle() {
  const [dark, setDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggle} type="button">
      {dark ? "☀ Light" : "☾ Dark"}
    </Button>
  );
}
