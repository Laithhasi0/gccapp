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
import { Check } from "lucide-react";
import { getTeam } from "@/lib/getTeam";

// Reads team from the CMS at request time so new people appear without a redeploy.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description:
    "GCC App is a premium digital agency in Riyadh building mobile apps, web apps, e-commerce, branding, marketing and SEO.",
};

const whyUs = [
  "Senior team, no hand-offs to juniors",
  "Clear process and transparent pricing",
  "Performance and accessibility by default",
  "Long-term partnership and 24/7 support",
];

export default async function AboutPage() {
  const team = await getTeam();
  return (
    <>
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Badge>About GCC App</Badge>
            <h1 className="mt-5">Level up your business with GCC App</h1>
            <p className="mt-5 text-lg">
              We specialize in building powerful mobile applications, web
              applications and modern websites that help businesses grow and
              succeed in the digital world. Our team develops scalable, secure and
              user-friendly solutions tailored to the unique needs of each client.
            </p>
            <p className="mt-4">
              By combining technology, creativity and strategy, we deliver
              end-to-end digital solutions that drive measurable success.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ParallaxImage
              src="/media/images/09-about-lifestyle.png"
              alt="The GCC App team collaborating in a bright modern office"
              priority
              className="aspect-[16/10] rounded-[var(--radius-lg)] border border-border shadow-sm"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>
        </div>
      </Section>

      <Stats />

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Why us"
            title="The difference is in the details"
            description="We sweat the things that make products feel premium — and the ones that move your numbers."
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
          eyebrow="Our people"
          title="The people behind the work"
          description="A close-knit team of designers, engineers and strategists — here's what each of us is working on."
        />
        <Container className="mt-14 px-0">
          <TeamGrid members={team} />
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
