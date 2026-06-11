import type { Metadata } from "next";
import { Space_Grotesk, Inter, Cairo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { AnimatedBackground } from "@/components/motion/AnimatedBackground";
import { LiveAppearance } from "@/components/motion/LiveAppearance";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { EditProvider } from "@/components/edit/EditProvider";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { OrganizationJsonLd } from "@/components/JsonLd";
import { getSiteSettings, getAppearance } from "@/lib/cms";
import { getLocale } from "@/lib/getLocale";
import { getUI, getNav, dir } from "@/lib/i18n";
import { site } from "@/content/site";

const display = Space_Grotesk({
  variable: "--ff-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const body = Inter({
  variable: "--ff-body",
  subsets: ["latin"],
  display: "swap",
});

const arabic = Cairo({
  variable: "--ff-arabic",
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "GCC App — Premium Digital Agency",
    template: "%s · GCC App",
  },
  description: site.description,
  keywords: [
    "digital agency",
    "mobile app development",
    "web development",
    "e-commerce",
    "branding",
    "SEO",
    "Riyadh",
    "Saudi Arabia",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "GCC App — Premium Digital Agency",
    description: site.description,
    url: site.url,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GCC App — Premium Digital Agency",
    description: site.description,
    images: [site.ogImage],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = getUI(locale);
  const nav = getNav(locale);
  const [settings, appearance] = await Promise.all([
    getSiteSettings(),
    getAppearance(),
  ]);

  const accentStyle = {
    "--accent": appearance.accentColor,
    "--accent-hover": appearance.accentHover,
    ...(appearance.backgroundColor ? { "--background": appearance.backgroundColor } : {}),
  } as React.CSSProperties;

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      style={accentStyle}
      className={`${appearance.theme === "light" ? "" : "dark"} ${display.variable} ${body.variable} ${arabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-ink">
        <OrganizationJsonLd />
        <LiveAppearance initialData={appearance} />
        <AnimatedBackground />
        <SmoothScroll />
        <ScrollProgress />
        <LocaleProvider locale={locale} messages={messages}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-contrast"
          >
            {messages.skipToContent}
          </a>
          <EditProvider>
            <Header settings={settings} nav={nav} />
            <main id="main" className="relative z-10 flex-1">
              {children}
            </main>
            <Footer settings={settings} nav={nav} />
          </EditProvider>
          <ScrollToTop />
        </LocaleProvider>
      </body>
    </html>
  );
}
