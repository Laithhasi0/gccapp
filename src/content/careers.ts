export type Career = {
  slug: string;
  role: string;
  location: string;
  type: string;
  description: string;
};

export const careers: Career[] = [
  {
    slug: "senior-frontend-engineer",
    role: "Senior Frontend Engineer",
    location: "Riyadh / Remote",
    type: "Full-time",
    description:
      "Build premium web products with Next.js, React and TypeScript. You care about performance, accessibility and clean, maintainable code.",
  },
  {
    slug: "product-designer",
    role: "Product Designer",
    location: "Riyadh / Remote",
    type: "Full-time",
    description:
      "Design clear, modern interfaces from research through to polished UI. Strong systems thinking and a sharp eye for detail.",
  },
  {
    slug: "mobile-engineer",
    role: "Mobile Engineer (React Native)",
    location: "Remote",
    type: "Full-time",
    description:
      "Ship delightful iOS and Android apps with React Native. Bonus points for native Swift or Kotlin experience.",
  },
  {
    slug: "digital-marketing-specialist",
    role: "Digital Marketing Specialist",
    location: "Riyadh",
    type: "Full-time",
    description:
      "Plan and run paid and organic campaigns that drive measurable growth, with clear reporting and a test-and-learn mindset.",
  },
];

export const getCareer = (slug: string) => careers.find((c) => c.slug === slug);
