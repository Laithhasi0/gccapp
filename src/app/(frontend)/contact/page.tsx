import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { Editable } from "@/components/edit/Editable";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with GCC App. Tell us about your project and we'll reply within one business day.",
};

const details = [
  { icon: Mail, label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}` },
  { icon: Phone, label: "Phone", value: site.contact.phone, href: site.contact.phoneHref },
  { icon: MapPin, label: "Office", value: site.contact.address },
  { icon: Clock, label: "Hours", value: "Sun–Thu, 9:00–18:00 · 24/7 support" },
];

export default function ContactPage() {
  return (
    <Editable href="/admin/globals/site-settings" label="Contact details">
      <Section>
        <div className="grid gap-12 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <Badge>Contact</Badge>
          <h1 className="mt-5">Let&apos;s build something exceptional</h1>
          <p className="mt-5 text-lg">
            Tell us about your project and we&apos;ll get back to you within one
            business day.
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
            <ContactForm />
          </div>
        </Reveal>
        </div>
      </Section>
    </Editable>
  );
}
