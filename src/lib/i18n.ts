/**
 * Bilingual (Arabic / English) support — pure & client-safe.
 *
 * Arabic is the DEFAULT language and renders RTL. The visitor's choice is stored
 * in the `NEXT_LOCALE` cookie (see getLocale.ts on the server and
 * LanguageSwitcher.tsx on the client). NO URL prefixes are used.
 *
 * This module has no server-only imports so it can be used from both server
 * components (via getUI) and client components (via the LocaleProvider context).
 */

export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(v: string | undefined | null): v is Locale {
  return v === "ar" || v === "en";
}

export function dir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export type NavChild = { label: string; href: string; description: string; image: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

const en = {
  skipToContent: "Skip to content",
  lang: { toggleTo: "العربية", current: "English", label: "Language" },
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    {
      label: "Services",
      href: "/services",
      children: [
        { label: "Mobile App Development", href: "/services/mobile-app", description: "iOS & Android, native and cross-platform.", image: "/media/images/03-service-mobile-app.webp" },
        { label: "Web Design & Development", href: "/services/web-design", description: "Fast, modern, accessible websites.", image: "/media/images/04-service-web-design.webp" },
        { label: "E-Commerce", href: "/services/e-commerce", description: "Stores that convert and scale.", image: "/media/images/05-service-ecommerce.webp" },
        { label: "Branding", href: "/services/branding", description: "Identity systems with clarity.", image: "/media/images/06-service-branding.webp" },
        { label: "Digital Marketing", href: "/services/digital-marketing", description: "Growth across paid and organic.", image: "/media/images/07-service-digital-marketing.webp" },
        { label: "SEO", href: "/services/seo", description: "Sustainable search visibility.", image: "/media/images/08-service-seo.webp" },
      ],
    },
    {
      label: "Portfolio",
      href: "/portfolio",
      children: [
        { label: "E-Commerce", href: "/portfolio?category=E-Commerce", description: "Online stores & marketplaces.", image: "/media/images/10-portfolio-ecommerce.webp" },
        { label: "Mobile Apps", href: "/portfolio?category=Mobile", description: "iOS & Android products.", image: "/media/images/12-portfolio-mobile-ios.webp" },
        { label: "Dashboards & CRM", href: "/portfolio?category=Dashboard", description: "Internal tools & platforms.", image: "/media/images/13-portfolio-dashboard-crm.webp" },
        { label: "Branding", href: "/portfolio?category=Branding", description: "Identity & design systems.", image: "/media/images/11-portfolio-branding.webp" },
      ],
    },
    { label: "Case Studies", href: "/case-studies" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ] as NavItem[],
  footer: {
    company: "Company",
    services: "Services",
    getInTouch: "Get in touch",
    careers: "Careers",
    privacy: "Privacy",
    terms: "Terms",
    rights: "All rights reserved.",
  },
  buttons: {
    learnMore: "Learn more",
    viewProject: "View project",
    viewAllProjects: "View all projects",
    viewOurWork: "View our work",
    startProject: "Start a project",
    getStarted: "Get Started",
    viewPortfolio: "View Portfolio",
    backHome: "Back home",
    contactUs: "Contact us",
    discussProject: "Discuss your project",
    exploreService: "Explore the service",
    meetTeam: "Meet the team",
    readCaseStudy: "Read the case study",
  },
  form: {
    name: "Name",
    email: "Email",
    company: "Company",
    companyPh: "Company (optional)",
    serviceOfInterest: "Service of interest",
    selectService: "Select a service",
    other: "Other",
    message: "Message",
    yourNamePh: "Your name",
    emailCompanyPh: "you@company.com",
    emailPersonalPh: "you@email.com",
    messagePh: "Tell us about your project…",
    role: "Role",
    portfolioLinkedin: "Portfolio / LinkedIn",
    linkPh: "https://…",
    whyYou: "Why you?",
    whyYouPh: "Tell us a little about yourself…",
    send: "Send message",
    sending: "Sending…",
    sendAnother: "Send another message",
    thankYou: "Thank you!",
    thankYouBody: "We've received your message and will reply within one business day.",
    submitApplication: "Submit application",
    applicationReceived: "Application received!",
    applicationReceivedBody: "Thanks for applying. We'll be in touch if there's a fit.",
    errorGeneric: "Something went wrong. Please try again.",
    careerApplication: "Career application",
    applyingFor: "Applying for",
  },
  filter: { all: "All" },
  categories: {
    "E-Commerce": "E-Commerce",
    Mobile: "Mobile",
    Dashboard: "Dashboard",
    Branding: "Branding",
    "Web App": "Web App",
    Development: "Development",
    CRM: "CRM",
    "Web Design": "Web Design",
  } as Record<string, string>,
  departments: {
    Engineering: "Engineering",
    Design: "Design",
    Marketing: "Marketing",
    Management: "Management",
  } as Record<string, string>,
  caps: { headingFull: "Everything you need, end to end" },
  cta: {
    title: "Ready to build something exceptional?",
    description: "Tell us about your project. We'll get back within one business day.",
    primary: "Start a project",
    secondary: "View our work",
  },
  featuredProjects: {
    eyebrow: "Selected work",
    title: "Projects we're proud of",
    description: "A glimpse of recent work across commerce, mobile, dashboards and brand.",
  },
  contactDetails: {
    email: "Email",
    phone: "Phone",
    office: "Office",
    hours: "Hours",
    hoursValue: "Sun–Thu, 9:00–18:00 · 24/7 support",
  },
  pages: {
    home: {
      contact: {
        eyebrow: "Contact",
        title: "Let's talk about your project",
        description: "Tell us what you're building. We'll reply within one business day.",
      },
    },
    about: {
      badge: "About GCC App",
      title: "Level up your business with GCC App",
      intro1: "We specialize in building powerful mobile applications, web applications and modern websites that help businesses grow and succeed in the digital world. Our team develops scalable, secure and user-friendly solutions tailored to the unique needs of each client.",
      intro2: "By combining technology, creativity and strategy, we deliver end-to-end digital solutions that drive measurable success.",
      imageAlt: "The GCC App team collaborating in a bright modern office",
      whyUs: {
        eyebrow: "Why us",
        title: "The difference is in the details",
        description: "We sweat the things that make products feel premium — and the ones that move your numbers.",
        items: [
          "Senior team, no hand-offs to juniors",
          "Clear process and transparent pricing",
          "Performance and accessibility by default",
          "Long-term partnership and 24/7 support",
        ],
      },
      ourPeople: {
        eyebrow: "Our people",
        title: "The people behind the work",
        description: "A close-knit team of designers, engineers and strategists — here's what each of us is working on.",
      },
    },
    services: {
      eyebrow: "Services",
      title: "Everything you need to build and grow",
      description: "End-to-end digital solutions — from apps and websites to branding, marketing and support.",
    },
    portfolio: {
      eyebrow: "Portfolio",
      title: "Work we're proud to share",
      description: "A selection of recent products across industries and platforms.",
      galleryEyebrow: "Inside the app",
      galleryTitle: "A look at the experience",
      galleryDescription: "Key screens from the product, designed for clarity and speed.",
      galleryScreen: "screen",
      client: "Client",
      year: "Year",
      category: "Category",
      overview: "Overview",
      keyFeatures: "Key features",
      builtWith: "Built with",
      nextProject: "Next project",
      allProjects: "All projects",
      challenge: "Challenge",
      solution: "Solution",
      result: "Result",
    },
    caseStudies: {
      eyebrow: "Case studies",
      title: "Results that speak for themselves",
      description: "A closer look at how we approach real problems — and the outcomes we deliver.",
      listTitle: "How we deliver results",
      listDescription: "Real problems, clear approaches and the outcomes that followed.",
      allCaseStudies: "All case studies",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Questions, answered",
      description: "Everything you need to know about working with us. Still curious? Get in touch.",
    },
    careers: {
      eyebrow: "Careers",
      title: "Build great products with great people",
      description: "We're a senior, close-knit team that values craft, ownership and balance.",
      applyEyebrow: "Apply",
      applyTitle: "Tell us about yourself",
      applyDescription: "Don't see your exact role? Apply anyway — we're always glad to meet talented people.",
    },
    contact: {
      badge: "Contact",
      title: "Let's build something exceptional",
      intro: "Tell us about your project and we'll get back to you within one business day.",
    },
    serviceDetail: {
      allServices: "All services",
      service: "Service",
      whatsIncluded: "What's included",
      discussProject: "Discuss your project",
    },
    notFound: {
      badge: "404",
      title: "This page wandered off",
      body: "The page you're looking for doesn't exist or has moved. Let's get you back on track.",
      backHome: "Back home",
      contactUs: "Contact us",
    },
    legal: {
      updated: "Updated",
      updatedLabel: "Last updated",
      privacy: {
        title: "Privacy Policy",
        updated: "June 2026",
        intro:
          "This policy explains what information we collect, how we use it, and the choices you have. We keep things simple and respect your privacy.",
        blocks: [
          {
            heading: "Information we collect",
            body: [
              "When you submit a form on our website, we collect the details you provide — such as your name, email, company and message — so we can respond to your enquiry.",
              "We may collect anonymous usage data to understand how the site is used and to improve it.",
            ],
          },
          {
            heading: "How we use your information",
            body: [
              "We use your information solely to respond to your enquiries, deliver our services and improve our website. We do not sell your data.",
            ],
          },
          {
            heading: "Data retention",
            body: [
              "We retain submissions only as long as necessary to handle your request and meet legal obligations.",
            ],
          },
          {
            heading: "Your rights",
            body: [
              "You can request access to, correction of, or deletion of your personal data at any time by emailing info@gccapp.com.",
            ],
          },
          {
            heading: "Contact",
            body: ["Questions about this policy? Email info@gccapp.com."],
          },
        ],
      },
      terms: {
        title: "Terms of Service",
        updated: "June 2026",
        intro:
          "These terms govern your use of the GCC App website. By using the site, you agree to them.",
        blocks: [
          {
            heading: "Use of the site",
            body: [
              "You may use this website for lawful purposes only. You agree not to misuse the site or attempt to disrupt its operation.",
            ],
          },
          {
            heading: "Intellectual property",
            body: [
              "All content on this site — text, design, graphics and code — is owned by GCC App unless otherwise stated, and may not be reproduced without permission.",
            ],
          },
          {
            heading: "Services",
            body: [
              "Information on this site about our services is provided for general guidance. Specific engagements are governed by a separate agreement.",
            ],
          },
          {
            heading: "Limitation of liability",
            body: [
              "The site is provided 'as is'. To the extent permitted by law, GCC App is not liable for any loss arising from your use of the site.",
            ],
          },
          {
            heading: "Contact",
            body: ["Questions about these terms? Email info@gccapp.com."],
          },
        ],
      },
    },
  },
};

export type Dict = typeof en;

const ar: Dict = {
  skipToContent: "تخطَّ إلى المحتوى",
  lang: { toggleTo: "English", current: "العربية", label: "اللغة" },
  nav: [
    { label: "الرئيسية", href: "/" },
    { label: "من نحن", href: "/about" },
    {
      label: "خدماتنا",
      href: "/services",
      children: [
        { label: "تطوير تطبيقات الجوال", href: "/services/mobile-app", description: "أنظمة iOS و Android، أصلية ومتعددة المنصات.", image: "/media/images/03-service-mobile-app.webp" },
        { label: "تصميم وتطوير المواقع", href: "/services/web-design", description: "مواقع سريعة وحديثة وسهلة الوصول.", image: "/media/images/04-service-web-design.webp" },
        { label: "التجارة الإلكترونية", href: "/services/e-commerce", description: "متاجر تبيع وتتوسّع.", image: "/media/images/05-service-ecommerce.webp" },
        { label: "الهوية التجارية", href: "/services/branding", description: "أنظمة هوية واضحة.", image: "/media/images/06-service-branding.webp" },
        { label: "التسويق الرقمي", href: "/services/digital-marketing", description: "نمو عبر القنوات المدفوعة والعضوية.", image: "/media/images/07-service-digital-marketing.webp" },
        { label: "تحسين محركات البحث", href: "/services/seo", description: "ظهور مستدام في نتائج البحث.", image: "/media/images/08-service-seo.webp" },
      ],
    },
    {
      label: "أعمالنا",
      href: "/portfolio",
      children: [
        { label: "التجارة الإلكترونية", href: "/portfolio?category=E-Commerce", description: "متاجر وأسواق إلكترونية.", image: "/media/images/10-portfolio-ecommerce.webp" },
        { label: "تطبيقات الجوال", href: "/portfolio?category=Mobile", description: "منتجات iOS و Android.", image: "/media/images/12-portfolio-mobile-ios.webp" },
        { label: "لوحات التحكم وإدارة العملاء", href: "/portfolio?category=Dashboard", description: "أدوات ومنصات داخلية.", image: "/media/images/13-portfolio-dashboard-crm.webp" },
        { label: "الهوية التجارية", href: "/portfolio?category=Branding", description: "أنظمة هوية وتصميم.", image: "/media/images/11-portfolio-branding.webp" },
      ],
    },
    { label: "دراسات الحالة", href: "/case-studies" },
    { label: "الأسئلة الشائعة", href: "/faq" },
    { label: "تواصل معنا", href: "/contact" },
  ] as NavItem[],
  footer: {
    company: "الشركة",
    services: "الخدمات",
    getInTouch: "تواصل معنا",
    careers: "الوظائف",
    privacy: "الخصوصية",
    terms: "الشروط",
    rights: "جميع الحقوق محفوظة.",
  },
  buttons: {
    learnMore: "اعرف المزيد",
    viewProject: "عرض المشروع",
    viewAllProjects: "عرض كل المشاريع",
    viewOurWork: "شاهد أعمالنا",
    startProject: "ابدأ مشروعك",
    getStarted: "ابدأ الآن",
    viewPortfolio: "تصفّح أعمالنا",
    backHome: "العودة للرئيسية",
    contactUs: "تواصل معنا",
    discussProject: "ناقش مشروعك",
    exploreService: "استكشف الخدمة",
    meetTeam: "تعرّف على الفريق",
    readCaseStudy: "اقرأ دراسة الحالة",
  },
  form: {
    name: "الاسم",
    email: "البريد الإلكتروني",
    company: "الشركة",
    companyPh: "الشركة (اختياري)",
    serviceOfInterest: "الخدمة المطلوبة",
    selectService: "اختر خدمة",
    other: "أخرى",
    message: "الرسالة",
    yourNamePh: "اسمك",
    emailCompanyPh: "you@company.com",
    emailPersonalPh: "you@email.com",
    messagePh: "أخبرنا عن مشروعك…",
    role: "الوظيفة",
    portfolioLinkedin: "أعمالك / لينكدإن",
    linkPh: "https://…",
    whyYou: "لماذا أنت؟",
    whyYouPh: "أخبرنا قليلًا عن نفسك…",
    send: "إرسال الرسالة",
    sending: "جارٍ الإرسال…",
    sendAnother: "إرسال رسالة أخرى",
    thankYou: "شكرًا لك!",
    thankYouBody: "لقد استلمنا رسالتك وسنرد عليك خلال يوم عمل واحد.",
    submitApplication: "إرسال الطلب",
    applicationReceived: "تم استلام طلبك!",
    applicationReceivedBody: "شكرًا لتقديمك. سنتواصل معك إذا كان هناك تطابق مناسب.",
    errorGeneric: "حدث خطأ ما. حاول مرة أخرى.",
    careerApplication: "طلب توظيف",
    applyingFor: "التقديم على وظيفة",
  },
  filter: { all: "الكل" },
  categories: {
    "E-Commerce": "التجارة الإلكترونية",
    Mobile: "تطبيقات الجوال",
    Dashboard: "لوحات التحكم",
    Branding: "الهوية التجارية",
    "Web App": "تطبيقات الويب",
    Development: "التطوير",
    CRM: "إدارة العملاء",
    "Web Design": "تصميم المواقع",
  },
  departments: {
    Engineering: "الهندسة",
    Design: "التصميم",
    Marketing: "التسويق",
    Management: "الإدارة",
  },
  caps: { headingFull: "كل ما تحتاجه، من البداية إلى النهاية" },
  cta: {
    title: "جاهز لبناء شيء استثنائي؟",
    description: "أخبرنا عن مشروعك وسنعاود التواصل معك خلال يوم عمل واحد.",
    primary: "ابدأ مشروعك",
    secondary: "شاهد أعمالنا",
  },
  featuredProjects: {
    eyebrow: "أعمال مختارة",
    title: "مشاريع نفخر بها",
    description: "لمحة عن أعمالنا الحديثة في التجارة والتطبيقات ولوحات المعلومات والهوية.",
  },
  contactDetails: {
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    office: "المكتب",
    hours: "ساعات العمل",
    hoursValue: "الأحد–الخميس، 9:00–18:00 · دعم على مدار الساعة",
  },
  pages: {
    home: {
      contact: {
        eyebrow: "تواصل",
        title: "لنتحدث عن مشروعك",
        description: "أخبرنا بما تبنيه. سنرد عليك خلال يوم عمل واحد.",
      },
    },
    about: {
      badge: "عن GCC App",
      title: "ارتقِ بأعمالك مع GCC App",
      intro1: "نحن متخصصون في بناء تطبيقات جوال قوية وتطبيقات ويب ومواقع حديثة تساعد الشركات على النمو والنجاح في العالم الرقمي. يطوّر فريقنا حلولًا قابلة للتوسّع وآمنة وسهلة الاستخدام مصمّمة وفق الاحتياجات الفريدة لكل عميل.",
      intro2: "من خلال الجمع بين التقنية والإبداع والاستراتيجية، نقدّم حلولًا رقمية متكاملة تحقّق نجاحًا قابلًا للقياس.",
      imageAlt: "فريق GCC App يتعاون في مكتب عصري مضيء",
      whyUs: {
        eyebrow: "لماذا نحن",
        title: "الفرق يكمن في التفاصيل",
        description: "نهتم بالتفاصيل التي تمنح المنتجات طابعًا احترافيًا — وتلك التي تحرّك أرقامك.",
        items: [
          "فريق متمرّس، دون إحالة العمل إلى المبتدئين",
          "عملية واضحة وتسعير شفّاف",
          "الأداء وسهولة الوصول كأساس افتراضي",
          "شراكة طويلة الأمد ودعم على مدار الساعة",
        ],
      },
      ourPeople: {
        eyebrow: "فريقنا",
        title: "الأشخاص خلف العمل",
        description: "فريق متماسك من المصممين والمهندسين والاستراتيجيين — وهذا ما يعمل عليه كل منا.",
      },
    },
    services: {
      eyebrow: "خدماتنا",
      title: "كل ما تحتاجه للبناء والنمو",
      description: "حلول رقمية متكاملة — من التطبيقات والمواقع إلى الهوية والتسويق والدعم.",
    },
    portfolio: {
      eyebrow: "أعمالنا",
      title: "أعمال نفخر بمشاركتها",
      description: "مجموعة من أحدث المنتجات عبر مختلف القطاعات والمنصات.",
      galleryEyebrow: "داخل التطبيق",
      galleryTitle: "نظرة على التجربة",
      galleryDescription: "شاشات أساسية من المنتج، مصمّمة للوضوح والسرعة.",
      galleryScreen: "شاشة",
      client: "العميل",
      year: "السنة",
      category: "الفئة",
      overview: "نظرة عامة",
      keyFeatures: "أبرز المزايا",
      builtWith: "بُني باستخدام",
      nextProject: "المشروع التالي",
      allProjects: "كل المشاريع",
      challenge: "التحدّي",
      solution: "الحل",
      result: "النتيجة",
    },
    caseStudies: {
      eyebrow: "دراسات الحالة",
      title: "نتائج تتحدث عن نفسها",
      description: "نظرة أقرب على كيفية تعاملنا مع المشكلات الحقيقية — والنتائج التي نحققها.",
      listTitle: "كيف نحقق النتائج",
      listDescription: "مشكلات حقيقية، ومقاربات واضحة، والنتائج التي تلتها.",
      allCaseStudies: "كل دراسات الحالة",
    },
    faq: {
      eyebrow: "الأسئلة الشائعة",
      title: "أسئلة وإجابات",
      description: "كل ما تحتاج معرفته عن العمل معنا. ما زلت مهتمًا؟ تواصل معنا.",
    },
    careers: {
      eyebrow: "الوظائف",
      title: "اصنع منتجات رائعة مع أشخاص رائعين",
      description: "نحن فريق متمرّس ومتماسك يقدّر الإتقان والمسؤولية والتوازن.",
      applyEyebrow: "التقديم",
      applyTitle: "أخبرنا عن نفسك",
      applyDescription: "لا ترى وظيفتك تحديدًا؟ قدّم على أي حال — يسعدنا دائمًا لقاء المواهب.",
    },
    contact: {
      badge: "تواصل",
      title: "لنبنِ شيئًا استثنائيًا",
      intro: "أخبرنا عن مشروعك وسنعاود التواصل معك خلال يوم عمل واحد.",
    },
    serviceDetail: {
      allServices: "كل الخدمات",
      service: "خدمة",
      whatsIncluded: "ما الذي يشمله",
      discussProject: "ناقش مشروعك",
    },
    notFound: {
      badge: "404",
      title: "هذه الصفحة غير موجودة",
      body: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها. لنعدك إلى المسار الصحيح.",
      backHome: "العودة إلى الرئيسية",
      contactUs: "تواصل معنا",
    },
    legal: {
      updated: "آخر تحديث",
      updatedLabel: "آخر تحديث",
      privacy: {
        title: "سياسة الخصوصية",
        updated: "يونيو 2026",
        intro:
          "توضّح هذه السياسة المعلومات التي نجمعها، وكيفية استخدامها، والخيارات المتاحة لك. نبقي الأمور بسيطة ونحترم خصوصيتك.",
        blocks: [
          {
            heading: "المعلومات التي نجمعها",
            body: [
              "عند إرسالك لنموذج على موقعنا، نجمع التفاصيل التي تقدّمها — مثل اسمك وبريدك الإلكتروني وشركتك ورسالتك — حتى نتمكن من الرد على استفسارك.",
              "قد نجمع بيانات استخدام مجهولة الهوية لفهم كيفية استخدام الموقع وتحسينه.",
            ],
          },
          {
            heading: "كيف نستخدم معلوماتك",
            body: [
              "نستخدم معلوماتك حصريًا للرد على استفساراتك، وتقديم خدماتنا، وتحسين موقعنا. نحن لا نبيع بياناتك.",
            ],
          },
          {
            heading: "الاحتفاظ بالبيانات",
            body: [
              "نحتفظ بالطلبات المرسلة فقط طوال المدة اللازمة لمعالجة طلبك والوفاء بالالتزامات القانونية.",
            ],
          },
          {
            heading: "حقوقك",
            body: [
              "يمكنك طلب الاطلاع على بياناتك الشخصية أو تصحيحها أو حذفها في أي وقت عبر مراسلتنا على info@gccapp.com.",
            ],
          },
          {
            heading: "تواصل",
            body: ["هل لديك أسئلة حول هذه السياسة؟ راسلنا على info@gccapp.com."],
          },
        ],
      },
      terms: {
        title: "شروط الخدمة",
        updated: "يونيو 2026",
        intro:
          "تحكم هذه الشروط استخدامك لموقع GCC App. باستخدامك للموقع، فإنك توافق عليها.",
        blocks: [
          {
            heading: "استخدام الموقع",
            body: [
              "يجوز لك استخدام هذا الموقع للأغراض المشروعة فقط. وتوافق على عدم إساءة استخدام الموقع أو محاولة تعطيل تشغيله.",
            ],
          },
          {
            heading: "الملكية الفكرية",
            body: [
              "جميع المحتويات على هذا الموقع — النصوص والتصميم والرسومات والشيفرة — مملوكة لـ GCC App ما لم يُذكر خلاف ذلك، ولا يجوز إعادة إنتاجها دون إذن.",
            ],
          },
          {
            heading: "الخدمات",
            body: [
              "المعلومات الواردة في هذا الموقع حول خدماتنا مقدّمة لأغراض إرشادية عامة. أما الارتباطات المحددة فتخضع لاتفاقية منفصلة.",
            ],
          },
          {
            heading: "حدود المسؤولية",
            body: [
              "يُقدَّم الموقع «كما هو». وإلى الحد الذي يسمح به القانون، فإن GCC App غير مسؤولة عن أي خسارة تنشأ عن استخدامك للموقع.",
            ],
          },
          {
            heading: "تواصل",
            body: ["هل لديك أسئلة حول هذه الشروط؟ راسلنا على info@gccapp.com."],
          },
        ],
      },
    },
  },
};

const dictionaries: Record<Locale, Dict> = { en, ar };

export function getUI(locale: Locale): Dict {
  return dictionaries[locale];
}

/** Localized navigation for a given locale. */
export function getNav(locale: Locale): NavItem[] {
  return dictionaries[locale].nav;
}

/** Translate an internal (English) category value for display. */
export function tCategory(locale: Locale, value: string): string {
  return dictionaries[locale].categories[value] ?? value;
}

/** Translate an internal (English) department value for display. */
export function tDepartment(locale: Locale, value: string): string {
  return dictionaries[locale].departments[value] ?? value;
}
