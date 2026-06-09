import { Button } from "./Button";
import { Container } from "./Container";
import { Reveal } from "@/components/motion/Reveal";

type Props = {
  title?: string;
  description?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
};

/** Calm full-width cyan band call-to-action. */
export function CTASection({
  title = "Ready to build something exceptional?",
  description = "Tell us about your project. We'll get back within one business day.",
  primary = { label: "Start a project", href: "/contact" },
  secondary = { label: "View our work", href: "/portfolio" },
}: Props) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[var(--radius-lg)] bg-accent px-6 py-14 text-center text-accent-contrast sm:px-12 sm:py-16">
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-accent-contrast">{title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-accent-contrast/85">
              {description}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                href={primary.href}
                className="bg-accent-contrast text-accent hover:bg-accent-contrast/90"
              >
                {primary.label}
              </Button>
              <Button
                href={secondary.href}
                variant="ghost"
                className="border-accent-contrast/40 text-accent-contrast hover:border-accent-contrast hover:text-accent-contrast"
              >
                {secondary.label}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
