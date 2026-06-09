import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/Prose";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of the GCC App website.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="June 2026"
      intro="These terms govern your use of the GCC App website. By using the site, you agree to them."
      blocks={[
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
      ]}
    />
  );
}
