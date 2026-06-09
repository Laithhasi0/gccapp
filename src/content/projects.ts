import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "ecommerce-platform",
    title: "E-Commerce Platform",
    category: "E-Commerce",
    client: "Retail client",
    year: 2025,
    cover: "/media/images/10-portfolio-ecommerce.webp",
    excerpt: "A complete online store platform built to sell products effectively.",
    challenge:
      "The client needed a fast, scalable online store that was easy to manage and ready to grow with their catalogue.",
    solution:
      "We built a modern storefront with a streamlined checkout, search and merchandising the team can run themselves.",
    result:
      "A fast, conversion-focused store that scales with the business.",
    tags: ["E-Commerce", "Storefront", "Payments", "Checkout"],
  },
  {
    slug: "saas-integration",
    title: "SaaS Integration",
    category: "Web App",
    client: "Technology client",
    year: 2025,
    cover: "/media/images/14-portfolio-cloud-infra.webp",
    excerpt: "Software-as-a-service integration connecting tools, data and workflows.",
    challenge:
      "Disconnected tools and data made day-to-day operations slow and error-prone.",
    solution:
      "We integrated the client's SaaS stack into a single, reliable workflow with clean data flow.",
    result:
      "A connected platform with less manual work and a single source of truth.",
    tags: ["SaaS", "Integration", "Cloud", "Automation"],
  },
  {
    slug: "mobile-platform",
    title: "Mobile Platform",
    category: "Mobile",
    client: "Confidential client",
    year: 2025,
    cover: "/media/images/12-portfolio-mobile-ios.webp",
    excerpt: "A cross-platform mobile experience for iOS and Android.",
    challenge:
      "The client wanted a single, high-quality mobile experience across both app stores.",
    solution:
      "We designed and built a scalable, secure mobile platform with a clean, friendly interface.",
    result:
      "A polished app shipped to iOS and Android with strong adoption.",
    tags: ["iOS", "Android", "Mobile", "Cross-platform"],
  },
  {
    slug: "vr-experience",
    title: "VR World Experience",
    category: "Web App",
    client: "Confidential client",
    year: 2024,
    cover: "/media/images/showcase-engineering.webp",
    excerpt: "An immersive virtual-reality world experience.",
    challenge:
      "The brief called for an engaging, immersive 3D environment users could explore.",
    solution:
      "We built an interactive VR world with smooth performance and intuitive navigation.",
    result:
      "An immersive experience that delighted users and stood out.",
    tags: ["VR", "3D", "Interactive", "Immersive"],
  },
  {
    slug: "custom-crm",
    title: "Custom CRM System",
    category: "Dashboard",
    client: "Operations client",
    year: 2024,
    cover: "/media/images/13-portfolio-dashboard-crm.webp",
    excerpt: "A custom CRM to organise customer data and track sales performance.",
    challenge:
      "Customer data lived across spreadsheets with no single view of the pipeline.",
    solution:
      "We built a custom CRM with live data, role-based access and clear reporting.",
    result:
      "One source of truth for customers and a clearer view of sales performance.",
    tags: ["CRM", "Dashboard", "Sales", "Reporting"],
  },
  {
    slug: "wearable-app",
    title: "Wearable Productivity App",
    category: "Mobile",
    client: "Confidential client",
    year: 2024,
    cover: "/media/images/03-service-mobile-app.webp",
    excerpt: "A wrist app designed to boost everyday productivity.",
    challenge:
      "Users needed quick, glanceable productivity tools on their wrist.",
    solution:
      "We designed a focused wearable app with fast interactions and clear, simple screens.",
    result:
      "A handy productivity companion that fits into daily routines.",
    tags: ["Wearable", "Mobile", "Productivity", "UX"],
  },
];

export const projectCategories = [
  "All",
  ...Array.from(new Set(projects.map((p) => p.category))),
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
