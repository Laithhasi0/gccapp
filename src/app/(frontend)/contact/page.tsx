import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { Editable } from "@/components/edit/Editable";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { getSiteSettings, getServices } from "@/lib/cms";
import { getLocale } from "@/lib/getLocale";
import { getUI } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const m = getUI(await getLocale()).meta.contact;
  return { title: m.title, description: m.description };
}

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const t = getUI(await getLocale());
  const settings = await getSiteSettings();
  const serviceOptions = (await getServices()).map((s) => s.title);
  const details = [
    { icon: Mail, label: t.contactDetails.email, value: settings.contact.email, href: `mailto:${settings.contact.email}` },
    { icon: Phone, label: t.contactDetails.phone, value: settings.contact.phone, href: settings.contact.phoneHref },
    { icon: MapPin, label: t.contactDetails.office, value: settings.contact.address },
    { icon: Clock, label: t.contactDetails.hours, value: t.contactDetails.hoursValue },
  ];
  return (
    <Editable href="/admin/globals/site-settings" label="Contact details">
      <Section>
        <div className="grid gap-12 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <Badge>{t.pages.contact.badge}</Badge>
          <h1 className="mt-5">{t.pages.contact.title}</h1>
          <p className="mt-5 text-lg">
            {t.pages.contact.intro}
          </p>
          <ul className="mt-10 space-y-5">
            {details.map((d) => {
              const Icon = d.icon;
              const content = (
                <>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-muted">{d.label}</span>
                    <span className="font-medium text-ink">{d.value}</span>
                  </span>
                </>
              );
              return (
                <li key={d.label} className="flex items-center gap-4">
                  {d.href ? (
                    <a href={d.href} className="flex items-center gap-4 hover:text-accent">
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-3">
          <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-sm sm:p-8">
            <ContactForm serviceOptions={serviceOptions} />
          </div>
        </Reveal>
        </div>
      </Section>
    </Editable>
  );
}
