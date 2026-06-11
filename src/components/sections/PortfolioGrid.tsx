"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type { Project } from "@/content/types";

export function PortfolioGrid({
  projects,
  categories,
  initialCategory = "All",
}: {
  projects: Project[];
  categories: string[];
  initialCategory?: string;
}) {
  const { t } = useI18n();
  const valid = categories.includes(initialCategory) ? initialCategory : "All";
  const [category, setCategory] = useState(valid);

  const filtered =
    category === "All"
      ? projects
      : projects.filter((p) => p.category === category);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              category === c
                ? "bg-accent text-accent-contrast"
                : "bg-accent-soft text-accent hover:bg-accent-soft/70"
            }`}
          >
            {c === "All" ? t.filter.all : (t.categories[c] ?? c)}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
