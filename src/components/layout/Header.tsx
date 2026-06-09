"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronDown, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { mainNav } from "@/content/site";
import type { SiteSettings } from "@/lib/cms";
import { cn } from "@/lib/utils";

export function Header({ settings }: { settings: SiteSettings }) {
  // Starts false to match server render (avoids hydration mismatch); the effect
  // syncs the real scroll position on mount.
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); // sync initial state post-hydration
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-background/85 backdrop-blur-md transition-[box-shadow,border-color] duration-300",
        scrolled ? "border-b border-border shadow-sm" : "border-b border-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight"
          aria-label={`${settings.siteName} home`}
        >
          {settings.logo ? (
            <Image
              src={settings.logo}
              alt={settings.siteName}
              width={130}
              height={32}
              className="h-8 w-auto object-contain"
              priority
            />
          ) : (
            <span>
              GCC<span className="text-accent">App</span>
            </span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {mainNav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-accent",
                    active ? "text-accent" : "text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-accent",
                    active ? "text-accent" : "text-ink",
                  )}
                  aria-expanded={openMenu === item.label}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Link>
                <AnimatePresence>
                  {openMenu === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-1/2 top-full w-[40rem] max-w-[92vw] -translate-x-1/2 pt-3"
                    >
                      <div className="grid grid-cols-2 gap-2 rounded-[var(--radius-lg)] border border-border bg-surface/95 p-3 shadow-lg backdrop-blur-md">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="group flex items-center gap-3 rounded-[var(--radius-sm)] p-2 transition-colors hover:bg-accent-soft"
                          >
                            {child.image && (
                              <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-[10px] bg-surface-tint">
                                <Image
                                  src={child.image}
                                  alt=""
                                  fill
                                  sizes="64px"
                                  className="object-cover transition-transform duration-500 ease-soft group-hover:scale-110"
                                />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1 text-sm font-medium text-ink group-hover:text-accent">
                                <span className="truncate">{child.label}</span>
                                <ArrowRight className="h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                              </div>
                              {child.description && (
                                <div className="mt-0.5 truncate text-xs text-muted">
                                  {child.description}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="hidden items-center gap-4 lg:flex">
          {settings.availabilityText && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {settings.availabilityText}
            </span>
          )}
          <a
            href={settings.contact.phoneHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-accent"
          >
            <Phone className="h-4 w-4" />
            {settings.contact.phone}
          </a>
          <Button href={settings.headerCta.href} size="sm">
            {settings.headerCta.label}
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden"
          >
            <nav
              className="border-t border-border bg-surface px-5 py-4"
              aria-label="Mobile"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("a")) setMobileOpen(false);
              }}
            >
              {mainNav.map((item) => (
                <div key={item.href} className="border-b border-border/70 last:border-0">
                  <Link
                    href={item.href}
                    className="block py-3 font-medium text-ink"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="-mt-1 mb-2 ml-3 flex flex-col gap-1.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="text-sm text-muted"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Button href={settings.headerCta.href} className="mt-4 w-full">
                {settings.headerCta.label}
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
