import type { TeamMember, Department } from "./types";

/**
 * Seed/fallback team data. Used when the CMS is unreachable (e.g. a build with
 * no database). The live site reads from Payload via `@/lib/getTeam` (server-only).
 * This module stays pure so client components can import `getDepartments`.
 */
export const teamData: TeamMember[] = [
  { name: "Layla Hassan", role: "Founder & CEO", workingOn: "GCC App platform & client strategy", initials: "LH", department: "Management", order: 1, featured: true },
  { name: "Omar Khalid", role: "Head of Engineering", workingOn: "Headless commerce architecture", initials: "OK", department: "Engineering", order: 2, featured: true },
  { name: "Sara Nasser", role: "Design Director", workingOn: "Meridian brand system", initials: "SN", department: "Design", order: 3, featured: true },
  { name: "Tariq Aziz", role: "Lead iOS Engineer", workingOn: "Horizon banking app", initials: "TA", department: "Engineering", order: 4, featured: true },
  { name: "Yousef Amin", role: "Lead Product Designer", workingOn: "Atlas operations dashboard", initials: "YA", department: "Design", order: 5 },
  { name: "Nadia Saleh", role: "Marketing Lead", workingOn: "Growth campaigns & lifecycle", initials: "NS", department: "Marketing", order: 6 },
];

export const byOrder = (a: TeamMember, b: TeamMember) =>
  (a.order ?? 999) - (b.order ?? 999);

/** Initials from a full name, e.g. "Omar Khalid" → "OK". */
export function initialsOf(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Departments present in the data, in a stable order. (Pure / client-safe.) */
export function getDepartments(members: TeamMember[]): Department[] {
  const order: Department[] = ["Engineering", "Design", "Marketing", "Management"];
  const present = new Set(members.map((m) => m.department).filter(Boolean));
  return order.filter((d) => present.has(d));
}
