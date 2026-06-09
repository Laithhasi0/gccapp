/**
 * Seed the Payload collections (team, services, projects + media) via REST.
 * Proves uploads work end to end. Idempotent — safe to re-run.
 *
 * Requires the dev server running on http://localhost:3000.
 * Run:  node scripts/seed.mjs
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";
import path from "node:path";

const BASE = process.env.SITE || "http://localhost:3000";
const IMG = path.resolve("public/media/images");
const ADMIN = { email: "admin@gccapp.com", password: "ChangeMe123!", name: "GCC Admin" };

/* --------------------------------- data ---------------------------------- */

const people = [
  { name: "Layla Hassan", role: "Founder & CEO", department: "Management", workingOn: "GCC App platform & client strategy", bio: "Layla founded GCC App to bring premium, honest digital craft to ambitious brands across the region.", socials: { linkedin: "https://linkedin.com", email: "layla@gccapp.com" }, order: 1, featured: true, tint: "#e3f3f6" },
  { name: "Omar Khalid", role: "Head of Engineering", department: "Engineering", workingOn: "Headless commerce architecture", bio: "Omar leads our engineering practice, obsessing over performance, reliability and clean systems.", socials: { linkedin: "https://linkedin.com", github: "https://github.com", x: "https://x.com" }, order: 2, featured: true, tint: "#dceef2" },
  { name: "Sara Nasser", role: "Design Director", department: "Design", workingOn: "Meridian brand system", bio: "Sara shapes the look and feel of everything we ship, with a sharp eye for clarity and detail.", socials: { linkedin: "https://linkedin.com", x: "https://x.com" }, order: 3, featured: true, tint: "#e6f4f6" },
  { name: "Tariq Aziz", role: "Lead iOS Engineer", department: "Engineering", workingOn: "Horizon banking app", bio: "Tariq builds delightful, secure mobile experiences in Swift and React Native.", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }, order: 4, featured: true, tint: "#dceef0" },
  { name: "Yousef Amin", role: "Lead Product Designer", department: "Design", workingOn: "Atlas operations dashboard", bio: "Yousef turns complex problems into calm, usable interfaces backed by solid systems thinking.", socials: { linkedin: "https://linkedin.com" }, order: 5, featured: false, tint: "#e9f5f7" },
  { name: "Nadia Saleh", role: "Marketing Lead", department: "Marketing", workingOn: "Growth campaigns & lifecycle", bio: "Nadia plans and runs campaigns that earn attention and revenue, measured end to end.", socials: { linkedin: "https://linkedin.com", x: "https://x.com", email: "nadia@gccapp.com" }, order: 6, featured: false, tint: "#dfeff1" },
];

const services = [
  { slug: "mobile-app", title: "Mobile App Development", icon: "smartphone", file: "03-service-mobile-app.png", excerpt: "High-performance mobile applications for iOS and Android.", body: ["We design and build mobile products end to end — from the first prototype to App Store and Google Play launch, and the iteration that follows.", "Our team builds scalable, secure and user-friendly apps tailored to the unique needs of your business."], features: ["iOS & Android development", "Scalable, secure architecture", "App Store & Play Store launch", "Ongoing support and updates"], seoDescription: "High-performance iOS and Android mobile app development by GCC App.", order: 1 },
  { slug: "web-design", title: "Web Design & Development", icon: "globe", file: "04-service-web-design.png", excerpt: "Modern, responsive websites optimized for all devices.", body: ["We craft modern, responsive websites and web applications that look great and perform on every device.", "Every build is fast, accessible and easy for your team to maintain."], features: ["Responsive, mobile-first design", "Fast and accessible builds", "Modern frameworks", "Easy to maintain"], seoDescription: "Modern, responsive web design and development by GCC App.", order: 2 },
  { slug: "e-commerce", title: "E-Commerce Development", icon: "shopping-cart", file: "05-service-ecommerce.png", excerpt: "Online stores built to sell your products effectively.", body: ["We build online stores engineered to convert — fast, secure and easy to manage.", "From catalogue to checkout, we obsess over the details that move revenue."], features: ["Custom & platform storefronts", "Conversion-focused checkout", "Payments & shipping", "Inventory management"], seoDescription: "E-commerce development and online stores by GCC App.", order: 3 },
  { slug: "branding", title: "Branding", icon: "palette", file: "06-service-branding.png", excerpt: "Build a strong, memorable identity for your business.", body: ["We build brand identities that scale across every surface — logo, type, colour, voice and the components that bring them to life.", "The result is a memorable identity your whole team can use confidently."], features: ["Logo & identity systems", "Brand guidelines", "Voice & messaging", "Collateral & templates"], seoDescription: "Brand identity and design systems by GCC App.", order: 4 },
  { slug: "digital-marketing", title: "Digital Marketing", icon: "megaphone", file: "07-service-digital-marketing.png", excerpt: "Targeted strategies to grow your audience and reach.", body: ["We plan and run campaigns that earn attention and revenue across paid, organic and lifecycle channels.", "Clear reporting at every step, optimised toward the numbers that matter."], features: ["Paid social & search", "Content & lifecycle", "Analytics & reporting", "Audience growth"], seoDescription: "Performance digital marketing by GCC App.", order: 5 },
  { slug: "seo", title: "SEO", icon: "search", file: "08-service-seo.png", excerpt: "Improve search rankings and increase organic traffic.", body: ["We improve search visibility the durable way — technical health, content that answers real intent, and authority that compounds.", "Every engagement starts with an audit and a prioritised roadmap."], features: ["Technical SEO audits", "Content & on-page", "Site speed & architecture", "Rank tracking & reporting"], seoDescription: "SEO and organic growth services by GCC App.", order: 6 },
  { slug: "it-support", title: "IT Support", icon: "server", file: "14-portfolio-cloud-infra.png", excerpt: "Reliable system maintenance and technical assistance.", body: ["We keep your systems running smoothly with proactive maintenance and responsive technical support.", "From infrastructure to day-to-day issues, we've got you covered."], features: ["Proactive maintenance", "Responsive support", "Infrastructure & cloud", "Monitoring & uptime"], seoDescription: "Reliable IT support and system maintenance by GCC App.", order: 7 },
  { slug: "crm", title: "CRM Solutions", icon: "users", file: "13-portfolio-dashboard-crm.png", excerpt: "Organize customer data and track sales performance.", body: ["We build and integrate CRM solutions that centralise your customer data and give you a single source of truth.", "Track sales performance, automate workflows and grow relationships."], features: ["Custom CRM builds", "Sales pipeline tracking", "Automation & workflows", "Integrations & reporting"], seoDescription: "Custom CRM solutions and integrations by GCC App.", order: 8 },
  { slug: "woocommerce", title: "WooCommerce", icon: "shopping-bag", file: "10-portfolio-ecommerce.png", excerpt: "Professional WooCommerce store setup and management.", body: ["We set up, customise and manage professional WooCommerce stores on WordPress.", "Themes, plugins, payments and performance — handled end to end."], features: ["Store setup & theming", "Plugins & extensions", "Payments & shipping", "Maintenance & support"], seoDescription: "Professional WooCommerce setup and management by GCC App.", order: 9 },
  { slug: "ui-ux", title: "UI/UX Design", icon: "pen-tool", file: "cap-design.png", excerpt: "User-focused interface and experience design.", body: ["We design clear, user-focused interfaces and experiences that feel effortless to use.", "Research, wireframes, prototypes and polished UI — grounded in real user journeys."], features: ["UX research & flows", "Wireframes & prototypes", "Polished UI design", "Design systems"], seoDescription: "User-focused UI/UX design by GCC App.", order: 10 },
];

const projects = [
  { slug: "ecommerce-platform", title: "E-Commerce Platform", category: "E-Commerce", client: "Retail client", year: 2025, file: "10-portfolio-ecommerce.png", excerpt: "A complete online store platform built to sell products effectively.", challenge: "The client needed a fast, scalable online store that was easy to manage and ready to grow with their catalogue.", solution: "We built a modern storefront with a streamlined checkout, search and merchandising the team can run themselves.", result: "A fast, conversion-focused store that scales with the business.", tags: ["E-Commerce", "Storefront", "Payments", "Checkout"], order: 1, featured: true },
  { slug: "saas-integration", title: "SaaS Integration", category: "Web App", client: "Technology client", year: 2025, file: "14-portfolio-cloud-infra.png", excerpt: "Software-as-a-service integration connecting tools, data and workflows.", challenge: "Disconnected tools and data made day-to-day operations slow and error-prone.", solution: "We integrated the client's SaaS stack into a single, reliable workflow with clean data flow.", result: "A connected platform with less manual work and a single source of truth.", tags: ["SaaS", "Integration", "Cloud", "Automation"], order: 2, featured: true },
  { slug: "mobile-platform", title: "Mobile Platform", category: "Mobile", client: "Confidential client", year: 2025, file: "12-portfolio-mobile-ios.png", excerpt: "A cross-platform mobile experience for iOS and Android.", challenge: "The client wanted a single, high-quality mobile experience across both app stores.", solution: "We designed and built a scalable, secure mobile platform with a clean, friendly interface.", result: "A polished app shipped to iOS and Android with strong adoption.", tags: ["iOS", "Android", "Mobile", "Cross-platform"], order: 3, featured: true },
  { slug: "vr-experience", title: "VR World Experience", category: "Web App", client: "Confidential client", year: 2024, file: "showcase-engineering.png", excerpt: "An immersive virtual-reality world experience.", challenge: "The brief called for an engaging, immersive 3D environment users could explore.", solution: "We built an interactive VR world with smooth performance and intuitive navigation.", result: "An immersive experience that delighted users and stood out.", tags: ["VR", "3D", "Interactive", "Immersive"], order: 4, featured: false },
  { slug: "custom-crm", title: "Custom CRM System", category: "Dashboard", client: "Operations client", year: 2024, file: "13-portfolio-dashboard-crm.png", excerpt: "A custom CRM to organise customer data and track sales performance.", challenge: "Customer data lived across spreadsheets with no single view of the pipeline.", solution: "We built a custom CRM with live data, role-based access and clear reporting.", result: "One source of truth for customers and a clearer view of sales performance.", tags: ["CRM", "Dashboard", "Sales", "Reporting"], order: 5, featured: false },
  { slug: "wearable-app", title: "Wearable Productivity App", category: "Mobile", client: "Confidential client", year: 2024, file: "03-service-mobile-app.png", excerpt: "A wrist app designed to boost everyday productivity.", challenge: "Users needed quick, glanceable productivity tools on their wrist.", solution: "We designed a focused wearable app with fast interactions and clear, simple screens.", result: "A handy productivity companion that fits into daily routines.", tags: ["Wearable", "Mobile", "Productivity", "UX"], order: 6, featured: false },
];

const caseStudies = [
  { slug: "souq-replatform", title: "Re-platforming for scale", category: "Development", file: "10-portfolio-ecommerce.png", summary: "How a headless rebuild cut load times in half and lifted conversion by a third.", metrics: [{ value: "2.1×", label: "Faster page loads" }, { value: "+34%", label: "Conversion uplift" }, { value: "100%", label: "Campaigns without dev" }], sections: [{ heading: "The challenge", body: "The legacy store buckled under catalogue growth — slow pages, a high-friction checkout and no self-serve merchandising." }, { heading: "What we did", body: "A headless storefront with composable commerce, faceted search and a three-step checkout, plus a merchandising layer the marketing team owns." }, { heading: "The outcome", body: "Sub-1.5s loads, a 34% conversion lift and a team that ships campaigns independently." }], order: 1 },
  { slug: "atlas-operations", title: "One source of truth for operations", category: "CRM", file: "13-portfolio-dashboard-crm.png", summary: "Replacing spreadsheets with a real-time operations dashboard.", metrics: [{ value: "−40%", label: "Faster dispatch" }, { value: "6", label: "Teams unified" }, { value: "<1s", label: "Live data latency" }], sections: [{ heading: "The challenge", body: "Operations ran across spreadsheets and email with no unified view of orders or customers." }, { heading: "What we did", body: "A unified dashboard with live data, role-based access and calm, readable reporting." }, { heading: "The outcome", body: "Dispatch time fell 40% and leadership gained a single source of truth." }], order: 2 },
  { slug: "horizon-redesign", title: "Rebuilding trust in the app", category: "Web Design", file: "12-portfolio-mobile-ios.png", summary: "A calm redesign that doubled self-service adoption.", metrics: [{ value: "4.7★", label: "App Store rating" }, { value: "+52%", label: "Self-service growth" }, { value: "−28%", label: "Onboarding drop-off" }], sections: [{ heading: "The challenge", body: "A confusing, slow app left customers calling support for routine tasks." }, { heading: "What we did", body: "A clean information architecture, biometric auth and a friendly onboarding flow." }, { heading: "The outcome", body: "Ratings rose and self-service transactions grew 52%." }], order: 3 },
];

const faqs = [
  { question: "How do projects with GCC App begin?", answer: "Every engagement starts with a consultation where we understand your goals, audience and constraints. We then share a clear plan, timeline and quote before any work begins.", category: "Getting started", order: 1 },
  { question: "Do you work with clients outside the GCC?", answer: "Yes. We're based in Riyadh and work with clients across the GCC and internationally, collaborating remotely with regular check-ins.", category: "Getting started", order: 2 },
  { question: "How much does a project cost?", answer: "It depends on scope. We provide a fixed, transparent quote after the planning phase so there are no surprises.", category: "Pricing", order: 3 },
  { question: "Do you offer ongoing support?", answer: "Yes — we offer support and maintenance so your product stays fast, secure and up to date after launch.", category: "Pricing", order: 4 },
  { question: "How long does a typical project take?", answer: "A marketing website is usually 4–8 weeks; a web or mobile app 8–16 weeks depending on complexity.", category: "Process", order: 5 },
  { question: "Can our team edit the website ourselves?", answer: "Absolutely. We build on a CMS so your team can update content, images and pages without touching code.", category: "Process", order: 6 },
  { question: "What technologies do you use?", answer: "Modern, reliable tools: Next.js and React for web, React Native and native for mobile, and a headless CMS for content.", category: "Technology", order: 7 },
  { question: "Will my site be fast and accessible?", answer: "Yes. We target excellent performance and accessibility, with solid contrast and keyboard support built in.", category: "Technology", order: 8 },
];

const careers = [
  { role: "Senior Frontend Engineer", slug: "senior-frontend-engineer", location: "Riyadh / Remote", type: "Full-time", description: "Build premium web products with Next.js, React and TypeScript. You care about performance, accessibility and clean code.", order: 1 },
  { role: "Product Designer", slug: "product-designer", location: "Riyadh / Remote", type: "Full-time", description: "Design clear, modern interfaces from research through to polished UI. Strong systems thinking and a sharp eye for detail.", order: 2 },
  { role: "Mobile Engineer (React Native)", slug: "mobile-engineer", location: "Remote", type: "Full-time", description: "Ship delightful iOS and Android apps with React Native. Bonus points for native Swift or Kotlin experience.", order: 3 },
  { role: "Digital Marketing Specialist", slug: "digital-marketing-specialist", location: "Riyadh", type: "Full-time", description: "Plan and run paid and organic campaigns that drive measurable growth, with clear reporting and a test-and-learn mindset.", order: 4 },
];

const capabilities = [
  { file: "cap-design.png", eyebrow: "Design & Brand", title: "Crafted with clarity", text: "Identity systems and interfaces designed around real people — clean, modern and effortless to use.", href: "/services/branding" },
  { file: "cap-web.png", eyebrow: "Web & Mobile", title: "Built to last", text: "Fast, robust web and mobile apps engineered on modern frameworks, with quality and accessibility baked in.", href: "/services/web-design" },
  { file: "cap-commerce.png", eyebrow: "Commerce & Product", title: "Made to scale", text: "Storefronts and digital products that load fast, convert well and grow with your business.", href: "/services/e-commerce" },
  { file: "cap-growth.png", eyebrow: "Marketing & Growth", title: "Made to grow", text: "Performance marketing and SEO that earn attention and compound into durable, measurable growth.", href: "/services/digital-marketing" },
];

const processSteps = [
  { title: "Consultation", description: "We start by understanding your goals, audience and scope." },
  { title: "Planning", description: "We turn the brief into a clear strategy and roadmap." },
  { title: "Design", description: "We design clean, user-friendly interfaces around real journeys." },
  { title: "Development", description: "We build scalable, secure and solid implementations." },
  { title: "Testing", description: "We verify everything works across devices and scenarios." },
  { title: "Launch & Support", description: "We go live and provide ongoing assistance and maintenance." },
];

/* -------------------------------- helpers -------------------------------- */

function initials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}
async function avatarPng(name, tint) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640"><defs><radialGradient id="g" cx="38%" cy="32%" r="80%"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="${tint}"/></radialGradient></defs><rect width="640" height="640" fill="url(#g)"/><text x="50%" y="50%" dy="0.35em" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="240" font-weight="600" fill="#0e8092" fill-opacity="0.85">${initials(name)}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}
async function api(p, opts = {}, token) {
  const headers = { ...(opts.headers || {}) };
  if (token) headers.Authorization = `JWT ${token}`;
  return fetch(`${BASE}${p}`, { ...opts, headers });
}
async function uploadBuffer(token, buf, filename, alt, type = "image/png") {
  const fd = new FormData();
  fd.append("_payload", JSON.stringify({ alt }));
  fd.append("file", new Blob([buf], { type }), filename);
  const res = await api("/api/media", { method: "POST", body: fd }, token);
  if (!res.ok) throw new Error(`upload ${filename}: ${res.status} ${await res.text()}`);
  return (await res.json()).doc;
}
async function uploadFile(token, file, alt) {
  return uploadBuffer(token, readFileSync(path.join(IMG, file)), file, alt);
}
async function count(token, slug) {
  return (await (await api(`/api/${slug}?limit=1`, {}, token)).json()).totalDocs;
}
async function create(token, slug, body) {
  const res = await api(`/api/${slug}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }, token);
  if (!res.ok) throw new Error(`create ${slug}/${body.slug || body.name}: ${res.status} ${await res.text()}`);
}

/* --------------------------------- main ---------------------------------- */

async function main() {
  let token;
  const reg = await api("/api/users/first-register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...ADMIN, roles: ["admin"] }) });
  if (reg.ok) { token = (await reg.json()).token; console.log("✓ Created admin:", ADMIN.email); }
  else {
    const login = await api("/api/users/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: ADMIN.email, password: ADMIN.password }) });
    if (!login.ok) { console.error("admin auth failed:", await reg.text()); process.exit(1); }
    token = (await login.json()).token; console.log("✓ Logged in as admin");
  }

  // Team
  if (await count(token, "team")) console.log("• team already seeded");
  else for (const p of people) {
    const m = await uploadBuffer(token, await avatarPng(p.name, p.tint), `${p.name.replace(/\s+/g, "-").toLowerCase()}.png`, `${p.name}, ${p.role} at GCC App`);
    await create(token, "team", { name: p.name, role: p.role, workingOn: p.workingOn, bio: p.bio, photo: m.id, department: p.department, socials: p.socials, order: p.order, featured: p.featured });
    console.log(`✓ team: ${p.name}`);
  }

  // Services
  if (await count(token, "services")) console.log("• services already seeded");
  else for (const s of services) {
    const m = await uploadFile(token, s.file, `${s.title} — GCC App service`);
    await create(token, "services", { slug: s.slug, title: s.title, icon: s.icon, excerpt: s.excerpt, image: m.id, body: s.body.map((text) => ({ text })), features: s.features.map((text) => ({ text })), seoDescription: s.seoDescription, order: s.order });
    console.log(`✓ service: ${s.title}`);
  }

  // Projects
  if (await count(token, "projects")) console.log("• projects already seeded");
  else for (const pr of projects) {
    const m = await uploadFile(token, pr.file, `${pr.title} — ${pr.category} project`);
    await create(token, "projects", { slug: pr.slug, title: pr.title, category: pr.category, client: pr.client, year: pr.year, cover: m.id, excerpt: pr.excerpt, challenge: pr.challenge, solution: pr.solution, result: pr.result, tags: pr.tags.map((tag) => ({ tag })), order: pr.order, featured: pr.featured });
    console.log(`✓ project: ${pr.title}`);
  }

  // Case studies
  if (await count(token, "case-studies")) console.log("• case studies already seeded");
  else for (const cs of caseStudies) {
    const m = await uploadFile(token, cs.file, `${cs.title} — case study`);
    await create(token, "case-studies", { slug: cs.slug, title: cs.title, category: cs.category, summary: cs.summary, cover: m.id, metrics: cs.metrics, sections: cs.sections, order: cs.order });
    console.log(`✓ case study: ${cs.title}`);
  }

  // FAQs
  if (await count(token, "faqs")) console.log("• faqs already seeded");
  else for (const f of faqs) {
    await create(token, "faqs", f);
    console.log(`✓ faq: ${f.question.slice(0, 32)}…`);
  }

  // Careers
  if (await count(token, "careers")) console.log("• careers already seeded");
  else for (const c of careers) {
    await create(token, "careers", c);
    console.log(`✓ career: ${c.role}`);
  }

  await seedGlobals(token);

  console.log("\n✓ Seed complete.");
}

async function updateGlobal(token, slug, data) {
  const res = await api(`/api/globals/${slug}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }, token);
  if (!res.ok) throw new Error(`global ${slug}: ${res.status} ${await res.text()}`);
}

async function seedGlobals(token) {
  const hc = await (await api("/api/globals/home-capabilities", {}, token)).json();
  if (hc?.items?.length) { console.log("• globals already set"); return; }

  await updateGlobal(token, "site-settings", {
    siteName: "GCC App",
    availabilityText: "Available for projects",
    contact: { email: "info@gccapp.com", phone: "+1 938 740 7555", phoneHref: "tel:+19387407555", address: "123 Tech Street, Riyadh, Saudi Arabia" },
    footerBlurb: "GCC App delivers innovative digital solutions, apps and services designed to simplify your business operations and boost productivity.",
    headerCta: { label: "Contact Us", href: "/contact" },
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "instagram", url: "https://instagram.com" },
      { platform: "twitter", url: "https://x.com" },
      { platform: "facebook", url: "https://facebook.com" },
      { platform: "dribbble", url: "https://dribbble.com" },
      { platform: "youtube", url: "https://youtube.com" },
    ],
  });
  console.log("✓ global: site-settings");

  await updateGlobal(token, "home-hero", {
    badge: "Digital solutions agency · Riyadh",
    headline: "Level up your business with",
    highlight: "GCC App",
    subheading: "We build powerful mobile applications, web applications and modern websites that help businesses grow and succeed in the digital world.",
    primaryCta: { label: "Get Started", href: "/contact" },
    secondaryCta: { label: "View Portfolio", href: "/portfolio" },
    backgroundVideoUrl: "/media/video/hero-background-loop.mp4",
    showStats: true,
    stats: [
      { value: "150+", label: "Projects delivered" },
      { value: "120+", label: "Happy clients" },
      { value: "98%", label: "Client satisfaction" },
      { value: "24/7", label: "Support" },
    ],
  });
  console.log("✓ global: home-hero");

  await updateGlobal(token, "home-process", {
    eyebrow: "How we work",
    heading: "A clear, proven process",
    description: "Six calm steps from first conversation to a confident launch — and the support that follows.",
    steps: processSteps,
  });
  console.log("✓ global: home-process");

  const capItems = [];
  for (const c of capabilities) {
    const m = await uploadFile(token, c.file, `${c.title} — capability`);
    capItems.push({ image: m.id, eyebrow: c.eyebrow, title: c.title, text: c.text, href: c.href });
  }
  await updateGlobal(token, "home-capabilities", { eyebrow: "What we do", items: capItems });
  console.log("✓ global: home-capabilities");

  await updateGlobal(token, "appearance", { theme: "dark", accentColor: "#25c9e2", accentHover: "#54d9ef" });
  console.log("✓ global: appearance");
}

main().catch((e) => { console.error(e); process.exit(1); });
