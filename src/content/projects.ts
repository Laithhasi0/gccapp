import type { Project } from "./types";

const P = "/media/images/portfolio";

export const projects: Project[] = [
  {
    slug: "university-smart-system",
    title: "University Smart System",
    category: "Mobile",
    client: "Thynk Unlimited",
    year: 2025,
    cover: `${P}/university-smart-system-cover.webp`,
    excerpt:
      "An AI-powered university platform — live lectures, smart exams and a GPT-4 tutor — backed by a full administrative control panel.",
    overview:
      "The University Smart System is an integrated digital platform that connects students, faculty and university administration through a cross-platform mobile app and a powerful web dashboard. Its standout move is bringing Artificial Intelligence into the heart of the educational process: a GPT-4 assistant that answers strictly from real course material using Retrieval-Augmented Generation, an automated exam engine, and live lecture streaming. Built on Laravel with 73+ secure API endpoints and a PostgreSQL database of 45+ tables, the system is engineered for thousands of concurrent users with sub-second response times and 99.9% uptime.",
    challenge:
      "Universities needed a single platform to run academics end to end — enrolment, lectures, exams, grading and communication — while modernising teaching with AI, all without sacrificing security or performance at scale.",
    solution:
      "We built a Flutter app for students and faculty plus a web control panel, wired to a Laravel API and PostgreSQL. AI is woven through the experience: a RAG-based GPT-4 tutor grounded in course files (500-word chunks, 1,536-dimension embeddings, cosine-similarity retrieval), an auto quiz generator, live streaming with automatic attendance, and instant exam grading.",
    result:
      "A complete smart-campus system: role-based accounts with admin approval, AI tutoring and quizzes, live lectures, e-exams, study plans, a university store and broadcast notifications — secured with Laravel Sanctum, Bcrypt, JWT, 2FA and RBAC.",
    features: [
      "AI Tutor powered by GPT-4 with RAG over real course content",
      "Smart quiz generator with difficulty levels and instant grading",
      "Live lecture streaming with automatic attendance tracking",
      "Automated MCQ examination system with percentage grades",
      "Personalised 7-day AI study plans and mastery tracking",
      "Real-time student–instructor messaging",
      "Integrated university store with full checkout",
      "Web administrative control panel with reporting",
    ],
    techStack: ["Flutter", "Laravel", "PostgreSQL", "OpenAI GPT-4", "Firebase", "Laravel Sanctum"],
    gallery: [
      `${P}/university-smart-system-1.webp`,
      `${P}/university-smart-system-2.webp`,
      `${P}/university-smart-system-3.webp`,
    ],
    tags: ["Flutter", "Laravel", "GPT-4", "PostgreSQL"],
  },
  {
    slug: "pet-haven",
    title: "Pet Haven",
    category: "Mobile",
    client: "Pet Haven",
    year: 2025,
    cover: `${P}/pet-haven-cover.webp`,
    excerpt:
      "An all-in-one pet-care app — shopping, vet consultations, grooming, bathing and pet-hotel booking — in one modern dark-themed experience.",
    overview:
      "Pet Haven is an integrated digital platform that gives pet owners a complete ecosystem in a single app. Instead of juggling scattered services, owners can shop for products and medical supplies, book grooming and bathing appointments, reserve pet-hotel stays and chat live with a veterinarian — all wrapped in a modern dark-theme interface with full Arabic and English support. It pairs a Flutter front end with a secure Laravel and MySQL backend, real-time messaging and Stripe payments.",
    challenge:
      "Pet owners struggled to find trusted products and professional services in one place. Existing solutions were scattered across different platforms, making everyday pet care complicated and time consuming.",
    solution:
      "We unified e-commerce, veterinary consultations, grooming, bathing and hotel reservations into one Flutter app with GetX state management and Lottie animations. A Laravel + MySQL backend handles authentication, catalogue and orders, while Laravel Reverb, Pusher and Firebase deliver real-time chat and notifications, and Stripe processes secure payments.",
    result:
      "A polished, bilingual pet-care marketplace that saves owners time and creates multiple revenue streams for the business — product sales, service commissions and vet consultations — all measurable from an admin dashboard with analytics.",
    features: [
      "Advanced e-commerce for pet products and medical supplies",
      "Smart shopping cart with real-time order tracking",
      "Grooming and bathing appointment booking",
      "Pet hotel reservation system",
      "Live veterinary consultation chat",
      "Instant push notifications and reminders",
      "Multi-language support (Arabic & English)",
      "Secure Stripe online payments",
    ],
    techStack: ["Flutter", "GetX", "Laravel", "MySQL", "Laravel Reverb", "Pusher", "Firebase FCM", "Stripe"],
    gallery: [
      `${P}/pet-haven-1.webp`,
      `${P}/pet-haven-2.webp`,
      `${P}/pet-haven-3.webp`,
    ],
    tags: ["Flutter", "Laravel", "Stripe", "Realtime"],
  },
  {
    slug: "pharmacy-assistant",
    title: "Pharmacy Assistant",
    category: "Mobile",
    client: "Pharmacy Assistant",
    year: 2025,
    cover: `${P}/pharmacy-assistant-cover.webp`,
    excerpt:
      "A smart digital pharmacy platform connecting customers and pharmacists — online store, live pharmacist consultations and secure payments.",
    overview:
      "Pharmacy Assistant modernises traditional pharmacy services by connecting pharmacies and customers through one integrated healthcare platform. It combines a smart online pharmacy store, real-time consultation with licensed pharmacists, secure payments and instant notifications into a single professional experience — reducing waiting times, improving accessibility and digitising the way people buy medicines and get medical guidance. The system is built with Flutter and a Dockerised Laravel + MySQL backend deployed on an Ubuntu VPS behind Nginx.",
    challenge:
      "Traditional pharmacies suffer from limited hours, long queues, difficulty finding medicines and weak communication between pharmacists and customers — hurting both satisfaction and operational efficiency.",
    solution:
      "We built a complete digital healthcare ecosystem: a searchable, filterable pharmacy store with ratings, a real-time licensed-pharmacist chat with one-hour sessions and history, a full order lifecycle (pending → shipped → delivered), OTP-secured accounts and a dynamic admin dashboard for banners, content and analytics.",
    result:
      "An easier, safer and more efficient way to purchase medicines and reach a pharmacist anytime — boosting healthcare accessibility for customers and unlocking new sales channels and efficiency for pharmacies, with a clear roadmap toward AI recommendations and video consultations.",
    features: [
      "Smart online pharmacy store with search, filter and ratings",
      "Real-time consultation with licensed pharmacists",
      "Full order lifecycle and live order tracking",
      "Secure OTP authentication and bcrypt encryption",
      "Instant push notifications via Firebase",
      "Dynamic content management (banners, videos, offers)",
      "Secure online payment processing",
      "Advanced administration dashboard",
    ],
    techStack: ["Flutter", "Dart", "GetX", "Laravel", "MySQL", "Firebase FCM", "Docker", "Nginx"],
    gallery: [
      `${P}/pharmacy-assistant-1.webp`,
      `${P}/pharmacy-assistant-2.webp`,
      `${P}/pharmacy-assistant-3.webp`,
    ],
    tags: ["Flutter", "Laravel", "Healthcare", "Docker"],
  },
];

export const projectCategories = [
  "All",
  ...Array.from(new Set(projects.map((p) => p.category))),
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
