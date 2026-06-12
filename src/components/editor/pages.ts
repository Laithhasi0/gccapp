/**
 * Pages available in the Visual Editor's page switcher.
 *
 * The home page is fully visual (sections, inline text). Other pages preview
 * live in the editor too: hover any block in the preview and click "✏️ Edit"
 * to open its editor, or use the shortcuts in the sidebar (`sources`).
 */

export type PageSource = {
  icon: string;
  title: string;
  desc: string;
  href: string;
  addHref?: string;
};

export type EditorPage = {
  path: string;
  label: string;
  icon: string;
  /** Fully visual (sections sidebar). Only the home page for now. */
  visual?: boolean;
  sources: PageSource[];
};

const brand: PageSource[] = [
  {
    icon: "⚙️",
    title: "Header, footer & contact details",
    desc: "Logo, navigation CTA, socials, email, phone, address.",
    href: "/admin/globals/site-settings",
  },
  {
    icon: "🌈",
    title: "Appearance",
    desc: "Theme, accent colour & background.",
    href: "/admin/globals/appearance",
  },
];

export const EDITOR_PAGES: EditorPage[] = [
  { path: "/", label: "Home", icon: "🏠", visual: true, sources: [] },
  {
    path: "/services",
    label: "Services",
    icon: "🛠️",
    sources: [
      {
        icon: "🛠️",
        title: "Service cards",
        desc: "Each card is a Service with its own text & image, in Arabic and English.",
        href: "/admin/collections/services",
        addHref: "/admin/collections/services/create",
      },
      ...brand,
    ],
  },
  {
    path: "/portfolio",
    label: "Portfolio",
    icon: "💼",
    sources: [
      {
        icon: "💼",
        title: "Projects",
        desc: "Covers, galleries, categories and project details.",
        href: "/admin/collections/projects",
        addHref: "/admin/collections/projects/create",
      },
      ...brand,
    ],
  },
  {
    path: "/case-studies",
    label: "Case Studies",
    icon: "📈",
    sources: [
      {
        icon: "📈",
        title: "Case studies",
        desc: "Stories, metrics and covers.",
        href: "/admin/collections/case-studies",
        addHref: "/admin/collections/case-studies/create",
      },
      ...brand,
    ],
  },
  {
    path: "/about",
    label: "About",
    icon: "👥",
    sources: [
      {
        icon: "👥",
        title: "Team members",
        desc: "People, photos, roles and bios.",
        href: "/admin/collections/team",
        addHref: "/admin/collections/team/create",
      },
      {
        icon: "📊",
        title: "Stats numbers",
        desc: "The animated numbers shown on the About page.",
        href: "/admin/globals/home-sections",
      },
      ...brand,
    ],
  },
  {
    path: "/faq",
    label: "FAQ",
    icon: "❓",
    sources: [
      {
        icon: "❓",
        title: "Questions & answers",
        desc: "Grouped by category, in Arabic and English.",
        href: "/admin/collections/faqs",
        addHref: "/admin/collections/faqs/create",
      },
      ...brand,
    ],
  },
  {
    path: "/careers",
    label: "Careers",
    icon: "💬",
    sources: [
      {
        icon: "💬",
        title: "Open roles",
        desc: "Job listings with location, type and description.",
        href: "/admin/collections/careers",
        addHref: "/admin/collections/careers/create",
      },
      ...brand,
    ],
  },
  {
    path: "/contact",
    label: "Contact",
    icon: "✉️",
    sources: brand,
  },
];
