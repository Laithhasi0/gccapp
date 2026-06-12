import { Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { getSiteSettings } from "@/lib/cms";

/** Home-page contact teaser: details (from Site Settings) + compact form. */
export async function ContactTeaser({
  eyebrow,
  title,
  description,
  editPath,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  editPath?: string;
}) {
  const settings = await getSiteSettings();
  return (
    <section className="relative bg-surface-tint py-16 sm:py-20 lg:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
              description={description}
              align="left"
              editPath={editPath}
            />
            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Mail className="h-5 w-5" />
                </span>
                <a href={`mailto:${settings.contact.email}`} className="text-ink hover:text-accent">
                  {settings.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Phone className="h-5 w-5" />
                </span>
                <a href={settings.contact.phoneHref} className="text-ink hover:text-accent">
                  {settings.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <MapPin className="h-5 w-5" />
                </span>
                <span className="text-ink">{settings.contact.address}</span>
              </li>
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-sm sm:p-8">
              <ContactForm compact />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
