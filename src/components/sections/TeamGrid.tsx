"use client";

import { useState } from "react";
import { TeamCard } from "@/components/ui/TeamCard";
import { getDepartments } from "@/content/team";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type { TeamMember } from "@/content/types";

export function TeamGrid({
  members,
  showFilter = true,
}: {
  members: TeamMember[];
  showFilter?: boolean;
}) {
  const { t } = useI18n();
  const departments = getDepartments(members);
  const [active, setActive] = useState<string>("All");

  const filtered =
    active === "All"
      ? members
      : members.filter((m) => m.department === active);

  const chips = ["All", ...departments];

  return (
    <div>
      {showFilter && departments.length > 1 && (
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              aria-pressed={active === c}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active === c
                  ? "bg-accent text-accent-contrast"
                  : "bg-accent-soft text-accent hover:bg-accent-soft/70"
              }`}
            >
              {c === "All" ? t.filter.all : (t.departments[c] ?? c)}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((member) => (
          <TeamCard key={member.name} member={member} />
        ))}
      </div>
    </div>
  );
}
