import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQItem } from "@/components/ui/FAQItem";
import { Reveal } from "@/components/motion/Reveal";
import { CTASection } from "@/components/ui/CTASection";
import { getFaqs } from "@/lib/cms";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about working with GCC App.",
};

export const dynamic = "force-dynamic";

export default async function FAQPage() {
  const faqs = await getFaqs();
  const faqCategories = Array.from(new Set(faqs.map((f) => f.category)));
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered"
          description="Everything you need to know about working with us. Still curious? Get in touch."
        />
        <div className="mx-auto mt-14 max-w-3xl space-y-12">
          {faqCategories.map((category) => (
            <Reveal key={category}>
              <h2 className="text-xl text-accent">{category}</h2>
              <div className="mt-3">
                {faqs
                  .filter((f) => f.category === category)
                  .map((faq) => (
                    <FAQItem key={faq.question} faq={faq} />
                  ))}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
      <CTASection />
    </>
  );
}
