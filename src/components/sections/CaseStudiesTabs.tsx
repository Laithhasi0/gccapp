"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EditPencil } from "@/components/edit/EditPencil";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type { CaseStudy } from "@/content/types";
import type { Heading } from "@/lib/cms";

export function CaseStudiesTabs({ studies, heading, editPath }: { studies: CaseStudy[]; heading?: Heading; editPath?: string }) {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const caseStudies = studies;
  const study = caseStudies[active];
  if (!study) return null;

  return (
    <section className="relative bg-surface py-16 sm:py-20 lg:py-28">
      <EditPencil href="/admin/globals/home-sections" label="Case studies" />
      <Container>
        <SectionHeading
          eyebrow={heading?.eyebrow ?? "Case studies"}
          title={heading?.title ?? "Results that speak for themselves"}
          description={heading?.description ?? "A closer look at how we approach real problems — and the outcomes we deliver."}
          editPath={editPath}
        />

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {caseStudies.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                i === active
                  ? "bg-accent text-accent-contrast"
                  : "bg-accent-soft text-accent hover:bg-accent-soft/70"
              }`}
            >
              {t.categories[c.category] ?? c.category}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={study.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 grid items-center gap-10 rounded-[var(--radius-lg)] border border-border bg-background p-6 shadow-sm lg:grid-cols-2 lg:p-10"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius)] bg-surface-tint">
              <Image
                src={study.cover}
                alt={study.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl">{study.title}</h3>
              <p className="mt-3">{study.summary}</p>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {study.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="font-display text-2xl font-semibold text-accent">
                      {m.value}
                    </div>
                    <div className="mt-1 text-xs text-muted">{m.label}</div>
                  </div>
                ))}
              </div>
              <Link
                href={`/case-studies/${study.slug}`}
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
              >
                {t.buttons.readCaseStudy}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}
