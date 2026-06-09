import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/Prose";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How GCC App collects, uses and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="June 2026"
      intro="This policy explains what information we collect, how we use it, and the choices you have. We keep things simple and respect your privacy."
      blocks={[
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
      ]}
    />
  );
}
