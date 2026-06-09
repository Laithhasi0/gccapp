import type { NavItem, Stat, ProcessStep } from "./types";

export const site = {
  name: "GCC App",
  tagline: "Level up your business with GCC App",
  description:
    "GCC App builds powerful mobile applications, web applications and modern websites that help businesses grow and succeed in the digital world — scalable, secure and user-friendly solutions tailored to each client.",
  url: "https://gccapp.com",
  ogImage: "/media/images/15-og-share-card.png",
  contact: {
    email: "info@gccapp.com",
    phone: "+1 938 740 7555",
    phoneHref: "tel:+19387407555",
    address: "123 Tech Street, Riyadh, Saudi Arabia",
  },
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { label: "X (Twitter)", href: "https://x.com", icon: "twitter" },
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
    { label: "Dribbble", href: "https://dribbble.com", icon: "dribbble" },
    { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
  ],
} as const;

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Mobile App Development", href: "/services/mobile-app", description: "iOS & Android, native and cross-platform.", image: "/media/images/03-service-mobile-app.png" },
      { label: "Web Design & Development", href: "/services/web-design", description: "Fast, modern, accessible websites.", image: "/media/images/04-service-web-design.png" },
      { label: "E-Commerce", href: "/services/e-commerce", description: "Stores that convert and scale.", image: "/media/images/05-service-ecommerce.png" },
      { label: "Branding", href: "/services/branding", description: "Identity systems with clarity.", image: "/media/images/06-service-branding.png" },
      { label: "Digital Marketing", href: "/services/digital-marketing", description: "Growth across paid and organic.", image: "/media/images/07-service-digital-marketing.png" },
      { label: "SEO", href: "/services/seo", description: "Sustainable search visibility.", image: "/media/images/08-service-seo.png" },
    ],
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    children: [
      { label: "E-Commerce", href: "/portfolio?category=E-Commerce", description: "Online stores & marketplaces.", image: "/media/images/10-portfolio-ecommerce.png" },
      { label: "Mobile Apps", href: "/portfolio?category=Mobile", description: "iOS & Android products.", image: "/media/images/12-portfolio-mobile-ios.png" },
      { label: "Dashboards & CRM", href: "/portfolio?category=Dashboard", description: "Internal tools & platforms.", image: "/media/images/13-portfolio-dashboard-crm.png" },
      { label: "Branding", href: "/portfolio?category=Branding", description: "Identity & design systems.", image: "/media/images/11-portfolio-branding.png" },
    ],
  },
  { label: "Case Studies", href: "/case-studies" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const stats: Stat[] = [
  { label: "Projects delivered", value: 150, suffix: "+" },
  { label: "Happy clients", value: 120, suffix: "+" },
  { label: "Client satisfaction", value: 98, suffix: "%" },
  { label: "Support", value: 24, suffix: "/7" },
];

export const processSteps: ProcessStep[] = [
  { title: "Consultation", description: "We start by understanding your goals, audience and scope." },
  { title: "Planning", description: "We turn the brief into a clear strategy and roadmap." },
  { title: "Design", description: "We design clean, user-friendly interfaces around real journeys." },
  { title: "Development", description: "We build scalable, secure and solid implementations." },
  { title: "Testing", description: "We verify everything works across devices and scenarios." },
  { title: "Launch & Support", description: "We go live and provide ongoing assistance and maintenance." },
];
