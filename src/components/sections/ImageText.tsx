import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { EditableText } from "@/components/edit/EditableText";

/** "Image & text" section added from the Visual Editor. */
export function ImageText({
  image,
  eyebrow,
  title,
  description,
  buttonLabel,
  buttonHref,
  imagePosition = "right",
  editPath,
}: {
  image?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
  imagePosition?: "left" | "right";
  editPath?: string;
}) {
  const text = (field: string, value?: string) =>
    editPath ? <EditableText path={`${editPath}.${field}`} value={value} /> : value;
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className={imagePosition === "left" ? "lg:order-2" : ""}>
            {eyebrow && <Badge>{text("eyebrow", eyebrow)}</Badge>}
            <h2 className={eyebrow ? "mt-4" : ""}>{text("title", title)}</h2>
            {description && <p className="mt-4 text-lg">{text("description", description)}</p>}
            {buttonLabel && (
              <div className="mt-7">
                <Button href={buttonHref || "/contact"}>{text("buttonLabel", buttonLabel)}</Button>
              </div>
            )}
          </Reveal>
          <Reveal delay={0.1} className={imagePosition === "left" ? "lg:order-1" : ""}>
            {image ? (
              <div className="ring-gradient relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-lg">
                <Image
                  src={image}
                  alt={title ?? ""}
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border bg-surface text-sm text-muted">
                Choose an image in the section settings
              </div>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
