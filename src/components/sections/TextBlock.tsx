import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Free-form "Custom text" section added from the Visual Editor. */
export function TextBlock({
  eyebrow,
  title,
  description,
  align = "center",
  editPath,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  align?: "left" | "center";
  editPath?: string;
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow={eyebrow || undefined}
          title={title ?? ""}
          description={description || undefined}
          align={align}
          editPath={editPath}
        />
      </Container>
    </section>
  );
}
