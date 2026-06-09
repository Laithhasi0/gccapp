import type { LucideIcon } from "lucide-react";

export type NavChild = {
  label: string;
  href: string;
  description?: string;
  image?: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export type Service = {
  slug: string;
  title: string;
  icon: LucideIcon;
  excerpt: string;
  image: string;
  body: string[];
  features: string[];
  seoDescription: string;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  client: string;
  year: number;
  cover: string;
  excerpt: string;
  challenge: string;
  solution: string;
  result: string;
  tags: string[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  cover: string;
  metrics: { label: string; value: string }[];
  sections: { heading: string; body: string }[];
};

export type Department = "Engineering" | "Design" | "Marketing" | "Management";

export type TeamSocials = {
  linkedin?: string;
  x?: string;
  github?: string;
  email?: string;
};

export type TeamMember = {
  name: string;
  role: string;
  /** Short "currently working on" line. */
  workingOn?: string;
  /** Short bio paragraph, revealed on hover/focus. */
  bio?: string;
  /** Square photo path (or undefined → initials avatar). */
  photo?: string;
  /** Alt text for the photo (required when photo is set). */
  alt?: string;
  initials: string;
  department?: Department;
  socials?: TeamSocials;
  /** Manual sort order (ascending). */
  order?: number;
  /** Show in the home-page featured variant. */
  featured?: boolean;
};

export type Faq = {
  question: string;
  answer: string;
  category: string;
};

export type Stat = { label: string; value: number; suffix?: string; prefix?: string };

export type ProcessStep = { title: string; description: string };
