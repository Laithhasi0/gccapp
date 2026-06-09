import { Hero } from "@/components/sections/Hero";
import { CapabilitiesShowcase } from "@/components/sections/CapabilitiesShowcase";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { Process } from "@/components/sections/Process";
import { CaseStudiesTabs } from "@/components/sections/CaseStudiesTabs";
import { HorizontalShowcase } from "@/components/sections/HorizontalShowcase";
import { FeaturedTeam } from "@/components/sections/FeaturedTeam";
import { CTASection } from "@/components/ui/CTASection";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { Editable } from "@/components/edit/Editable";
import { EditPencil } from "@/components/edit/EditPencil";
import { Mail, Phone, MapPin } from "lucide-react";
import { site } from "@/content/site";
import {
  getProjects,
  getHero,
  getCapabilities,
  getCaseStudies,
  getHomeSections,
} from "@/lib/cms";

// Renders CMS content at request time (updates with no redeploy).
export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, hero, capabilities, caseStudies, hs] = await Promise.all([
    getProjects(),
    getHero(),
    getCapabilities(),
    getCaseStudies(),
    getHomeSections(),
  ]);
  return (
    <>
      <Editable href="/admin/globals/home-hero" label="Hero">
        <Hero initialData={hero} />
      </Editable>
      <CapabilitiesShowcase eyebrow={capabilities.eyebrow} items={capabilities.items} />
      <Editable href="/admin/globals/home-sections" label="Services">
        <ServicesGrid heading={hs.services} />
      </Editable>
      <Editable href="/admin/globals/home-process" label="Process">
        <Process />
      </Editable>
      <CaseStudiesTabs studies={caseStudies} heading={hs.caseStudies} />
      <HorizontalShowcase projects={projects} heading={hs.selectedWork} />
      <Editable href="/admin/collections/team" label="Team">
        <FeaturedTeam heading={hs.team} />
      </Editable>
      <Editable href="/admin/globals/home-sections" label="Call to action">
        <CTASection
          title={hs.cta.title}
          description={hs.cta.description}
          primary={{ label: hs.cta.buttonLabel, href: hs.cta.buttonHref }}
        />
      </Editable>

      {/* Contact teaser */}
      <section className="relative bg-surface-tint py-16 sm:py-20 lg:py-28">
        <EditPencil href="/admin/globals/site-settings" label="Contact" />
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <SectionHeading
                eyebrow="Contact"
                title="Let's talk about your project"
                description="Tell us what you're building. We'll reply within one business day."
                align="left"
              />
              <ul className="mt-8 space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Mail className="h-5 w-5" />
                  </span>
                  <a href={`mailto:${site.contact.email}`} className="text-ink hover:text-accent">
                    {site.contact.email}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Phone className="h-5 w-5" />
                  </span>
                  <a href={site.contact.phoneHref} className="text-ink hover:text-accent">
                    {site.contact.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span className="text-ink">{site.contact.address}</span>
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
    </>
  );
}
