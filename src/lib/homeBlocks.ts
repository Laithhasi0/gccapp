/**
 * Home page block registry — client-safe (no payload/server imports).
 *
 * Single place that defines, for every section type on the home page:
 *  - identity (type, label, icon, description) for the "Add section" gallery
 *  - the settings-panel field schema rendered by the Visual Editor
 *  - default content used when a brand-new section is added
 *
 * Sections are stored FLAT: { id, type, hidden, ...fields } so that inline
 * edit paths coming from the live preview ("sections.2.steps.1.title") apply
 * directly to the editor state. `type` maps to the Payload blockType.
 */

export type MediaRef = { id?: number | string; url?: string } | null;

/**
 * Field names that are localized (stored per language) in the home-page
 * blocks — see src/globals/HomePage.ts. Everything else (links, values,
 * images, toggles) is shared between Arabic and English.
 */
export const LOCALIZED_TEXT_FIELDS = new Set([
  "badge",
  "headline",
  "highlight",
  "subheading",
  "eyebrow",
  "title",
  "description",
  "text",
  "label",
  "buttonLabel",
]);

export const isLocalizedField = (name: string): boolean => {
  const last = name.split(".").pop() ?? name;
  return LOCALIZED_TEXT_FIELDS.has(last);
};

export type BlockType =
  | "hero"
  | "capabilities"
  | "services"
  | "process"
  | "caseStudies"
  | "showcase"
  | "team"
  | "statsStrip"
  | "cta"
  | "contact"
  | "textBlock"
  | "imageText";

export type HomeSection = {
  id?: string;
  type: BlockType;
  hidden?: boolean;
} & Record<string, unknown>;

export type FieldDef =
  | { kind: "text"; name: string; label: string; placeholder?: string; localized?: boolean }
  | { kind: "textarea"; name: string; label: string; localized?: boolean }
  | { kind: "toggle"; name: string; label: string }
  | { kind: "select"; name: string; label: string; options: { value: string; label: string }[] }
  | { kind: "image"; name: string; label: string; urlName?: string }
  | { kind: "group"; name: string; label: string; fields: FieldDef[] }
  | {
      kind: "array";
      name: string;
      label: string;
      itemLabel: string;
      /** Field whose value names each row in the panel, e.g. "title". */
      titleField: string;
      fields: FieldDef[];
      max?: number;
    };

export type BlockDef = {
  type: BlockType;
  label: string;
  icon: string;
  description: string;
  /** Shown in the settings panel when section content comes from a collection. */
  note?: { text: string; manageHref: string; manageLabel: string };
  fields: FieldDef[];
  defaults: (locale: "en" | "ar") => HomeSection;
};

const link = (name: string, label: string): FieldDef => ({
  kind: "group",
  name,
  label,
  fields: [
    { kind: "text", name: "label", label: "Button text", localized: true },
    { kind: "text", name: "href", label: "Link (e.g. /contact)" },
  ],
});

const headingFields: FieldDef[] = [
  { kind: "text", name: "eyebrow", label: "Eyebrow (small label)", localized: true },
  { kind: "text", name: "title", label: "Title", localized: true },
  { kind: "textarea", name: "description", label: "Description", localized: true },
];

const statsField: FieldDef = {
  kind: "array",
  name: "stats",
  label: "Stats",
  itemLabel: "stat",
  titleField: "value",
  fields: [
    { kind: "text", name: "value", label: "Value", placeholder: "150+" },
    { kind: "text", name: "label", label: "Label", localized: true },
  ],
};

const ar = (locale: "en" | "ar") => locale === "ar";

export const BLOCKS: BlockDef[] = [
  {
    type: "hero",
    label: "Hero",
    icon: "✨",
    description: "Big opening headline, buttons, background and stats.",
    fields: [
      { kind: "text", name: "badge", label: "Badge (small pill)", localized: true },
      { kind: "text", name: "headline", label: "Headline", localized: true },
      { kind: "text", name: "highlight", label: "Highlighted word(s)", localized: true },
      { kind: "textarea", name: "subheading", label: "Subheading", localized: true },
      link("primaryCta", "Primary button"),
      link("secondaryCta", "Secondary button"),
      { kind: "image", name: "posterImage", label: "Background image", urlName: "posterImageUrl" },
      { kind: "text", name: "backgroundVideoUrl", label: "Background video URL (optional)" },
      { kind: "toggle", name: "showStats", label: "Show the stats strip" },
      statsField,
    ],
    defaults: (l) => ({
      type: "hero",
      badge: ar(l) ? "وكالة حلول رقمية" : "Digital solutions agency",
      headline: ar(l) ? "طوّر أعمالك مع" : "Level up your business with",
      highlight: ar(l) ? "GCC App" : "GCC App",
      subheading: ar(l)
        ? "نبني تطبيقات ومواقع حديثة تساعد أعمالك على النمو."
        : "We build modern apps and websites that help your business grow.",
      primaryCta: { label: ar(l) ? "ابدأ الآن" : "Get Started", href: "/contact" },
      secondaryCta: { label: ar(l) ? "شاهد أعمالنا" : "View Portfolio", href: "/portfolio" },
      showStats: true,
      stats: [],
    }),
  },
  {
    type: "capabilities",
    label: "What we do",
    icon: "🧩",
    description: "Scrolling showcase of your main capabilities with images.",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow (small label)", localized: true },
      {
        kind: "array",
        name: "items",
        label: "Capabilities",
        itemLabel: "capability",
        titleField: "title",
        fields: [
          { kind: "image", name: "image", label: "Image", urlName: "imageUrl" },
          { kind: "text", name: "eyebrow", label: "Eyebrow", localized: true },
          { kind: "text", name: "title", label: "Title", localized: true },
          { kind: "textarea", name: "text", label: "Text", localized: true },
          { kind: "text", name: "href", label: "Link (e.g. /services/branding)" },
        ],
      },
    ],
    defaults: (l) => ({
      type: "capabilities",
      eyebrow: ar(l) ? "ماذا نفعل" : "What we do",
      items: [
        {
          imageUrl: "/media/images/cap-design.webp",
          eyebrow: ar(l) ? "التصميم" : "Design",
          title: ar(l) ? "عنوان جديد" : "New capability",
          text: ar(l) ? "اكتب وصفاً قصيراً هنا." : "Write a short description here.",
          href: "/services",
        },
      ],
    }),
  },
  {
    type: "services",
    label: "Services grid",
    icon: "🛠️",
    description: "Your services as cards, pulled from the Services library.",
    note: {
      text: "The service cards themselves come from the Content Library.",
      manageHref: "/admin/collections/services",
      manageLabel: "Manage services",
    },
    fields: headingFields,
    defaults: (l) => ({
      type: "services",
      eyebrow: ar(l) ? "ماذا نقدم" : "What we do",
      title: ar(l) ? "خدمات مبنية حول النتائج" : "Services built around outcomes",
      description: ar(l)
        ? "من الفكرة الأولى إلى الإطلاق والنمو."
        : "From first idea to launch and growth.",
    }),
  },
  {
    type: "process",
    label: "Process steps",
    icon: "🪜",
    description: "Numbered 'how we work' steps.",
    fields: [
      ...headingFields,
      {
        kind: "array",
        name: "steps",
        label: "Steps",
        itemLabel: "step",
        titleField: "title",
        fields: [
          { kind: "text", name: "title", label: "Title", localized: true },
          { kind: "textarea", name: "description", label: "Description", localized: true },
        ],
      },
    ],
    defaults: (l) => ({
      type: "process",
      eyebrow: ar(l) ? "كيف نعمل" : "How we work",
      title: ar(l) ? "عملية واضحة ومجرّبة" : "A clear, proven process",
      description: "",
      steps: [
        {
          title: ar(l) ? "الخطوة الأولى" : "First step",
          description: ar(l) ? "اشرح هذه الخطوة." : "Describe this step.",
        },
      ],
    }),
  },
  {
    type: "caseStudies",
    label: "Case studies",
    icon: "📈",
    description: "Tabbed case studies with metrics, from the library.",
    note: {
      text: "The case studies themselves come from the Content Library.",
      manageHref: "/admin/collections/case-studies",
      manageLabel: "Manage case studies",
    },
    fields: headingFields,
    defaults: (l) => ({
      type: "caseStudies",
      eyebrow: ar(l) ? "دراسات حالة" : "Case studies",
      title: ar(l) ? "نتائج تتحدث عن نفسها" : "Results that speak for themselves",
      description: "",
    }),
  },
  {
    type: "showcase",
    label: "Selected work",
    icon: "💼",
    description: "Horizontal reel of featured projects from the Portfolio.",
    note: {
      text: "The projects themselves come from the Content Library.",
      manageHref: "/admin/collections/projects",
      manageLabel: "Manage projects",
    },
    fields: headingFields.slice(0, 2),
    defaults: (l) => ({
      type: "showcase",
      eyebrow: ar(l) ? "أعمال مختارة" : "Selected work",
      title: ar(l) ? "مشاريع نفتخر بها" : "Projects we're proud of",
    }),
  },
  {
    type: "team",
    label: "Team",
    icon: "👥",
    description: "Featured team members from the Team library.",
    note: {
      text: "The people themselves come from the Content Library.",
      manageHref: "/admin/collections/team",
      manageLabel: "Manage team",
    },
    fields: headingFields,
    defaults: (l) => ({
      type: "team",
      eyebrow: ar(l) ? "فريقنا" : "Our people",
      title: ar(l) ? "الفريق وراء العمل" : "The people behind the work",
      description: "",
    }),
  },
  {
    type: "statsStrip",
    label: "Stats strip",
    icon: "📊",
    description: "A band of animated numbers (projects delivered, % …).",
    fields: [statsField],
    defaults: (l) => ({
      type: "statsStrip",
      stats: [
        { value: "150+", label: ar(l) ? "مشروع منجز" : "Projects delivered" },
        { value: "98%", label: ar(l) ? "رضا العملاء" : "Client satisfaction" },
      ],
    }),
  },
  {
    type: "cta",
    label: "Call to action",
    icon: "📣",
    description: "Full-width colored band with a title and button.",
    fields: [
      { kind: "text", name: "title", label: "Title", localized: true },
      { kind: "textarea", name: "description", label: "Description", localized: true },
      { kind: "text", name: "buttonLabel", label: "Button text", localized: true },
      { kind: "text", name: "buttonHref", label: "Button link" },
    ],
    defaults: (l) => ({
      type: "cta",
      title: ar(l) ? "جاهز لبدء مشروعك؟" : "Ready to start your project?",
      description: ar(l)
        ? "أخبرنا عن فكرتك وسنتولى الباقي."
        : "Tell us about your idea and we'll take it from there.",
      buttonLabel: ar(l) ? "ابدأ مشروعاً" : "Start a project",
      buttonHref: "/contact",
    }),
  },
  {
    type: "contact",
    label: "Contact",
    icon: "✉️",
    description: "Contact details and a message form.",
    note: {
      text: "Email, phone and address come from Site Settings.",
      manageHref: "/admin/globals/site-settings",
      manageLabel: "Edit site settings",
    },
    fields: headingFields,
    defaults: (l) => ({
      type: "contact",
      eyebrow: ar(l) ? "تواصل معنا" : "Contact",
      title: ar(l) ? "لنتحدث عن مشروعك" : "Let's talk about your project",
      description: "",
    }),
  },
  {
    type: "textBlock",
    label: "Custom text",
    icon: "📝",
    description: "A free heading + paragraph section. Write anything.",
    fields: [
      ...headingFields,
      {
        kind: "select",
        name: "align",
        label: "Alignment",
        options: [
          { value: "center", label: "Center" },
          { value: "left", label: "Start" },
        ],
      },
    ],
    defaults: (l) => ({
      type: "textBlock",
      eyebrow: "",
      title: ar(l) ? "عنوان جديد" : "New heading",
      description: ar(l) ? "اكتب النص هنا." : "Write your text here.",
      align: "center",
    }),
  },
  {
    type: "imageText",
    label: "Image & text",
    icon: "🖼️",
    description: "An image beside a heading, text and optional button.",
    fields: [
      { kind: "image", name: "image", label: "Image", urlName: "imageUrl" },
      ...headingFields,
      { kind: "text", name: "buttonLabel", label: "Button text (optional)", localized: true },
      { kind: "text", name: "buttonHref", label: "Button link" },
      {
        kind: "select",
        name: "imagePosition",
        label: "Image position",
        options: [
          { value: "right", label: "Image after text" },
          { value: "left", label: "Image before text" },
        ],
      },
    ],
    defaults: (l) => ({
      type: "imageText",
      imageUrl: "/media/images/cap-design.webp",
      eyebrow: "",
      title: ar(l) ? "عنوان جديد" : "New heading",
      description: ar(l) ? "اكتب النص هنا." : "Write your text here.",
      buttonLabel: "",
      buttonHref: "",
      imagePosition: "right",
    }),
  },
];

export const blockDef = (type: string): BlockDef | undefined =>
  BLOCKS.find((b) => b.type === type);

export const blockLabel = (type: string): string => blockDef(type)?.label ?? type;
export const blockIcon = (type: string): string => blockDef(type)?.icon ?? "■";
