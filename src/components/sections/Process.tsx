import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { EditableText } from "@/components/edit/EditableText";
import type { ProcessStep } from "@/content/types";

export function Process({
  eyebrow,
  title,
  description,
  steps,
  editPath,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  steps: ProcessStep[];
  /** Visual Editor path prefix (e.g. "sections.3") — makes the text inline-editable. */
  editPath?: string;
}) {
  const text = (field: string, value: string) =>
    editPath ? <EditableText path={`${editPath}.${field}`} value={value} /> : value;
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} editPath={editPath} />
        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={`${step.title}-${i}`} delay={i * 0.06}>
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-base font-semibold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg">{text(`steps.${i}.title`, step.title)}</h3>
                  <p className="mt-1.5 text-sm">{text(`steps.${i}.description`, step.description)}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
