import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Stats } from "@/components/sections/Stats";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { CTASection } from "@/components/ui/CTASection";
import { Editable } from "@/components/edit/Editable";
import { Check } from "lucide-react";
import { getTeam } from "@/lib/getTeam";
import { getHomeSections } from "@/lib/cms";
import { getLocale } from "@/lib/getLocale";
import { getUI } from "@/lib/i18n";

// Reads team from the CMS at request time so new people appear without a redeploy.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description:
    "GCC App is a premium digital agency in Riyadh building mobile apps, web apps, e-commerce, branding, marketing and SEO.",
};

export default async function AboutPage() {
  const [team, hs] = await Promise.all([getTeam(), getHomeSections()]);
  const t = getUI(await getLocale());
  const whyUs = t.pages.about.whyUs.items;
  return (
    <>
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Badge>{t.pages.about.badge}</Badge>
            <h1 className="mt-5">{t.pages.about.title}</h1>
            <p className="mt-5 text-lg">
              {t.pages.about.intro1}
            </p>
            <p className="mt-4">
              {t.pages.about.intro2}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ParallaxImage
              src="/media/images/09-about-lifestyle.webp"
              alt={t.pages.about.imageAlt}
              priority
              className="aspect-[16/10] rounded-[var(--radius-lg)] border border-border shadow-sm"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>
        </div>
      </Section>

      <Editable href="/admin/globals/home-sections" label="Stats">
        <Stats items={hs.stats} />
      </Editable>

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow={t.pages.about.whyUs.eyebrow}
            title={t.pages.about.whyUs.title}
            description={t.pages.about.whyUs.description}
            align="left"
          />
          <ul className="space-y-4">
            {whyUs.map((item, i) => (
              <Reveal key={item} delay={i * 0.06}>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-ink">{item}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="team">
        <SectionHeading
          eyebrow={t.pages.about.ourPeople.eyebrow}
          title={t.pages.about.ourPeople.title}
          description={t.pages.about.ourPeople.description}
        />
        <Container className="mt-14 px-0">
          <TeamGrid members={team} />
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
