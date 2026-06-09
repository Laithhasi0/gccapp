import type { Faq } from "./types";

export const faqs: Faq[] = [
  {
    category: "Getting started",
    question: "How do projects with GCC App begin?",
    answer:
      "Every engagement starts with a consultation where we understand your goals, audience and constraints. We then share a clear plan, timeline and quote before any work begins.",
  },
  {
    category: "Getting started",
    question: "Do you work with clients outside the GCC?",
    answer:
      "Yes. We're based in Riyadh and work with clients across the GCC and internationally, collaborating remotely with regular check-ins.",
  },
  {
    category: "Pricing",
    question: "How much does a project cost?",
    answer:
      "It depends on scope. We provide a fixed, transparent quote after the planning phase so there are no surprises. Smaller sites start in the low five figures; larger products are scoped individually.",
  },
  {
    category: "Pricing",
    question: "Do you offer ongoing support?",
    answer:
      "Yes — we offer 24/7 support and maintenance retainers so your product stays fast, secure and up to date after launch.",
  },
  {
    category: "Process",
    question: "How long does a typical project take?",
    answer:
      "A marketing website is usually 4–8 weeks; a web or mobile app 8–16 weeks depending on complexity. We'll give you a realistic timeline during planning.",
  },
  {
    category: "Process",
    question: "Can our team edit the website ourselves?",
    answer:
      "Absolutely. We build on a CMS so your team can update content, images and pages without touching code. We provide a short handover and documentation.",
  },
  {
    category: "Technology",
    question: "What technologies do you use?",
    answer:
      "Modern, reliable tools: Next.js and React for web, React Native and native Swift/Kotlin for mobile, and a headless CMS for content. We choose the right stack for each project.",
  },
  {
    category: "Technology",
    question: "Will my site be fast and accessible?",
    answer:
      "Yes. We target Lighthouse scores of 90+ for performance and 95+ for accessibility, with AA contrast and full keyboard support built in from the start.",
  },
];

export const faqCategories = Array.from(new Set(faqs.map((f) => f.category)));
