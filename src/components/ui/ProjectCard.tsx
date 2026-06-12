"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { ItemPencil } from "@/components/edit/ItemPencil";
import type { Project } from "@/content/types";

export function ProjectCard({ project }: { project: Project }) {
  const { t } = useI18n();
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="hover-lift group block overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-tint">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.05]"
        />
        <ItemPencil collection="projects" id={project.id} label={project.title} className="end-2 top-2" />
        {/* Category badge */}
        <span className="absolute left-4 top-4 rounded-full bg-surface/90 px-3 py-1 text-xs font-medium text-accent backdrop-blur-sm">
          {t.categories[project.category] ?? project.category}
        </span>
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-ink/10 to-transparent opacity-0 transition-opacity duration-[var(--dur)] ease-soft group-hover:opacity-100">
          <span className="m-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-contrast">
            {t.buttons.viewProject}
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg transition-colors group-hover:text-accent">
          {project.title}
        </h3>
        <p className="mt-1.5 text-sm">{project.excerpt}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full bg-surface-tint px-2.5 py-1 text-xs text-muted"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
