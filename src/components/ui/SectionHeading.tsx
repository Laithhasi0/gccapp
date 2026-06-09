import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "./Badge";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

/** Reusable section header: eyebrow badge + heading + supporting line. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: Props) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <Badge>{eyebrow}</Badge>}
      <h2 className={cn(eyebrow && "mt-4")}>{title}</h2>
      {description && <p className="mt-4 text-lg">{description}</p>}
    </Reveal>
  );
}
