import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { getProcess } from "@/lib/cms";

export async function Process() {
  const { eyebrow, heading, description, steps } = await getProcess();
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={heading} description={description} />
        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06}>
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-base font-semibold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg">{step.title}</h3>
                  <p className="mt-1.5 text-sm">{step.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
