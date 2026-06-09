import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { EditPencil } from "@/components/edit/EditPencil";
import { mainNav } from "@/content/site";
import { services } from "@/content/services";
import type { SiteSettings } from "@/lib/cms";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="relative z-10 mt-auto border-t border-border bg-surface">
      <EditPencil href="/admin/globals/site-settings" label="Footer" className="right-4 top-4" />
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <Link
              href="/"
              className="font-display text-lg font-semibold tracking-tight"
            >
              GCC<span className="text-accent">App</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted">{settings.footerBlurb}</p>
            <div className="mt-5 flex gap-3">
              {settings.socials.map((s) => (
                <a
                  key={s.platform + s.url}
                  href={s.url}
                  aria-label={s.platform}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <SocialIcon name={s.platform} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-ink">Company</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {mainNav
                .filter((n) => !n.children || n.label === "Services")
                .map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      className="text-muted transition-colors hover:text-accent"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              <li>
                <Link href="/careers" className="text-muted transition-colors hover:text-accent">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-ink">Services</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-muted transition-colors hover:text-accent"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-ink">Get in touch</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-accent" />
                <a href={`mailto:${settings.contact.email}`} className="hover:text-accent">
                  {settings.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-accent" />
                <a href={settings.contact.phoneHref} className="hover:text-accent">
                  {settings.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-accent" />
                {settings.contact.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted sm:flex-row">
          <span>
            © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </span>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-accent">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-accent">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
