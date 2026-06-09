import { cn } from "@/lib/utils";
import { Container } from "./Container";

type Tone = "default" | "tint" | "surface" | "accent";

const toneClasses: Record<Tone, string> = {
  default: "bg-background text-ink",
  tint: "bg-surface-tint text-ink",
  surface: "bg-surface text-ink",
  accent: "bg-accent text-accent-contrast",
};

type SectionProps = {
  tone?: Tone;
  /** Wrap children in a centered Container. Set false for full-bleed content. */
  contained?: boolean;
  className?: string;
  containerClassName?: string;
  id?: string;
  children: React.ReactNode;
};

/** Vertical rhythm wrapper for page sections, with optional background tone. */
export function Section({
  tone = "default",
  contained = true,
  className,
  containerClassName,
  id,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-20 lg:py-28",
        toneClasses[tone],
        className,
      )}
    >
      {contained ? (
        <Container className={containerClassName}>{children}</Container>
      ) : (
        children
      )}
    </section>
  );
}
