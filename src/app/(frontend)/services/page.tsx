import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Reveal } from "@/components/motion/Reveal";
import { CTASection } from "@/components/ui/CTASection";
import { Editable } from "@/components/edit/Editable";
import { getServices } from "@/lib/cms";
import { getLocale } from "@/lib/getLocale";
import { getUI } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const m = getUI(await getLocale()).meta.services;
  return { title: m.title, description: m.description };
}

// CMS-driven — new/edited services appear without a redeploy.
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await getServices();
  const t = getUI(await getLocale());
  return (
    <>
      <Editable href="/admin/collections/services" label="Services">
        <Section>
          <SectionHeading
            eyebrow={t.pages.services.eyebrow}
            title={t.pages.services.title}
            description={t.pages.services.description}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 0.05}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </Section>
      </Editable>
      <CTASection />
    </>
  );
}
