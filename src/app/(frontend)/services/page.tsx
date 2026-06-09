import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Reveal } from "@/components/motion/Reveal";
import { CTASection } from "@/components/ui/CTASection";
import { Editable } from "@/components/edit/Editable";
import { getServices } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Mobile apps, web design, e-commerce, branding, digital marketing and SEO services from GCC App.",
};

// CMS-driven — new/edited services appear without a redeploy.
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <Editable href="/admin/collections/services" label="Services">
        <Section>
          <SectionHeading
            eyebrow="Services"
            title="Everything you need to build and grow"
            description="End-to-end digital solutions — from apps and websites to branding, marketing and support."
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
