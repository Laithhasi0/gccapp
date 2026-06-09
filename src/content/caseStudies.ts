import type { CaseStudy } from "./types";

export const caseStudies: CaseStudy[] = [
  {
    slug: "souq-replatform",
    title: "Re-platforming Souq for scale",
    category: "Development",
    summary:
      "How a headless rebuild cut load times in half and lifted conversion by a third.",
    cover: "/media/images/10-portfolio-ecommerce.png",
    metrics: [
      { label: "Faster page loads", value: "2.1×" },
      { label: "Conversion uplift", value: "+34%" },
      { label: "Campaigns without dev", value: "100%" },
    ],
    sections: [
      {
        heading: "The challenge",
        body: "The legacy store buckled under catalogue growth — slow pages, a high-friction checkout and no self-serve merchandising.",
      },
      {
        heading: "What we did",
        body: "A headless Next.js storefront with composable commerce, faceted search and a three-step checkout, plus a merchandising layer the marketing team owns.",
      },
      {
        heading: "The outcome",
        body: "Sub-1.5s loads, a 34% conversion lift and a team that ships campaigns independently.",
      },
    ],
  },
  {
    slug: "atlas-operations",
    title: "One source of truth for Atlas",
    category: "CRM",
    summary:
      "Replacing spreadsheets with a real-time operations dashboard for a logistics network.",
    cover: "/media/images/13-portfolio-dashboard-crm.png",
    metrics: [
      { label: "Faster dispatch", value: "−40%" },
      { label: "Teams unified", value: "6" },
      { label: "Live data latency", value: "<1s" },
    ],
    sections: [
      {
        heading: "The challenge",
        body: "Operations ran across spreadsheets and email with no unified view of fleet, orders or customers.",
      },
      {
        heading: "What we did",
        body: "A unified dashboard with live data, role-based access and calm, readable reporting.",
      },
      {
        heading: "The outcome",
        body: "Dispatch time fell 40% and leadership gained a single source of truth.",
      },
    ],
  },
  {
    slug: "horizon-redesign",
    title: "Rebuilding trust in the Horizon app",
    category: "Web Design",
    summary:
      "A calm redesign that doubled self-service adoption for a retail bank.",
    cover: "/media/images/12-portfolio-mobile-ios.png",
    metrics: [
      { label: "App Store rating", value: "4.7★" },
      { label: "Self-service growth", value: "+52%" },
      { label: "Onboarding drop-off", value: "−28%" },
    ],
    sections: [
      {
        heading: "The challenge",
        body: "A confusing, slow app left customers calling support for routine tasks.",
      },
      {
        heading: "What we did",
        body: "A clean information architecture, biometric auth and a friendly onboarding flow built on a shared design system.",
      },
      {
        heading: "The outcome",
        body: "Ratings rose from 3.1 to 4.7 and self-service transactions grew 52%.",
      },
    ],
  },
];

export const getCaseStudy = (slug: string) =>
  caseStudies.find((c) => c.slug === slug);
