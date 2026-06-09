import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { CTASection } from "@/components/ui/CTASection";
import { Editable } from "@/components/edit/Editable";
import { getProjects, getProjectCategories } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected work by GCC App across e-commerce, mobile apps, dashboards, branding and web.",
};

export const dynamic = "force-dynamic";

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [projects, categories] = await Promise.all([
    getProjects(),
    getProjectCategories(),
  ]);

  return (
    <>
      <Editable href="/admin/collections/projects" label="Portfolio">
        <Section>
          <SectionHeading
            eyebrow="Portfolio"
            title="Work we're proud to share"
            description="A selection of recent products across industries and platforms."
          />
          <div className="mt-12">
            <PortfolioGrid
              projects={projects}
              categories={categories}
              initialCategory={category ?? "All"}
            />
          </div>
        </Section>
      </Editable>
      <CTASection />
    </>
  );
}
