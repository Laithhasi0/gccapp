import type { Metadata } from "next";
import "../(frontend)/globals.css";

export const metadata: Metadata = {
  title: "Visual Editor · GCC App",
  robots: { index: false, follow: false },
};

/** Standalone chrome for the Visual Editor — no site header/footer. */
export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="dark h-full">
      <body className="h-full overflow-hidden bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
