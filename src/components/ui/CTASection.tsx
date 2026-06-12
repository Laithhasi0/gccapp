"use client";

import { Button } from "./Button";
import { Container } from "./Container";
import { Reveal } from "@/components/motion/Reveal";
import { EditableText } from "@/components/edit/EditableText";
import { useI18n } from "@/components/i18n/LocaleProvider";

type Props = {
  title?: string;
  description?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** Visual Editor path prefix (e.g. "sections.7") — makes the text inline-editable. */
  editPath?: string;
};

/** Calm full-width cyan band call-to-action. */
export function CTASection({
  title,
  description,
  primary,
  secondary,
  editPath,
}: Props) {
  const { t } = useI18n();
  const resolvedTitle = title ?? t.cta.title;
  const resolvedDescription = description ?? t.cta.description;
  const resolvedPrimary = primary ?? { label: t.cta.primary, href: "/contact" };
  const resolvedSecondary = secondary ?? { label: t.cta.secondary, href: "/portfolio" };
  const text = (field: string, value: string) =>
    editPath ? <EditableText path={`${editPath}.${field}`} value={value} /> : value;
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[var(--radius-lg)] bg-accent px-6 py-14 text-center text-accent-contrast sm:px-12 sm:py-16">
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-accent-contrast">{text("title", resolvedTitle)}</h2>
            <p className="mx-auto mt-4 max-w-xl text-accent-contrast/85">
              {text("description", resolvedDescription)}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                href={resolvedPrimary.href}
                className="bg-accent-contrast text-accent hover:bg-accent-contrast/90"
              >
                {text("buttonLabel", resolvedPrimary.label)}
              </Button>
              <Button
                href={resolvedSecondary.href}
                variant="ghost"
                className="border-accent-contrast/40 text-accent-contrast hover:border-accent-contrast hover:text-accent-contrast"
              >
                {resolvedSecondary.label}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
