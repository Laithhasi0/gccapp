import { Reveal } from "@/components/motion/Reveal";
import { EditableText } from "@/components/edit/EditableText";
import { Badge } from "./Badge";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  /** Visual Editor path prefix (e.g. "sections.2") — makes the text inline-editable. */
  editPath?: string;
};

/** Reusable section header: eyebrow badge + heading + supporting line. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  editPath,
}: Props) {
  const text = (field: string, value?: string) =>
    editPath ? <EditableText path={`${editPath}.${field}`} value={value} /> : value;
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <Badge>{text("eyebrow", eyebrow)}</Badge>}
      <h2 className={cn(eyebrow && "mt-4")}>{text("title", title)}</h2>
      {description && <p className="mt-4 text-lg">{text("description", description)}</p>}
    </Reveal>
  );
}
