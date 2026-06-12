import { Hero } from "@/components/sections/Hero";
import { CapabilitiesShowcase } from "@/components/sections/CapabilitiesShowcase";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { Process } from "@/components/sections/Process";
import { CaseStudiesTabs } from "@/components/sections/CaseStudiesTabs";
import { HorizontalShowcase } from "@/components/sections/HorizontalShowcase";
import { FeaturedTeam } from "@/components/sections/FeaturedTeam";
import { Stats } from "@/components/sections/Stats";
import { TextBlock } from "@/components/sections/TextBlock";
import { ImageText } from "@/components/sections/ImageText";
import { ContactTeaser } from "@/components/sections/ContactTeaser";
import { CTASection } from "@/components/ui/CTASection";
import { SectionShell } from "@/components/edit/SectionShell";
import { getCaseStudies, getProjects, type HeroData } from "@/lib/cms";
import { blockIcon, blockLabel, type HomeSection, type MediaRef } from "@/lib/homeBlocks";
import type { CaseStudy, Project } from "@/content/types";

/**
 * Renders the home page from its sections list (see src/lib/homePage.ts).
 * Every section is wrapped in a SectionShell so the Visual Editor can select,
 * outline and act on it; `editPath` makes its text editable in place.
 */

const str = (v: unknown): string => (typeof v === "string" ? v : "");

const img = (media: unknown, urlField: unknown): string | undefined =>
  (media as MediaRef)?.url || str(urlField) || undefined;

type Ctx = { projects: Project[]; caseStudies: CaseStudy[] };

function heading(s: HomeSection) {
  return { eyebrow: str(s.eyebrow), title: str(s.title), description: str(s.description) || undefined };
}

function renderSection(s: HomeSection, i: number, ctx: Ctx): React.ReactNode {
  const p = `sections.${i}`;
  switch (s.type) {
    case "hero": {
      const cta = (v: unknown, fallbackHref: string) => {
        const g = (v as { label?: string; href?: string }) || {};
        return { label: str(g.label), href: g.href || fallbackHref };
      };
      const data: HeroData = {
        badge: str(s.badge),
        headline: str(s.headline),
        highlight: str(s.highlight),
        subheading: str(s.subheading),
        primaryCta: cta(s.primaryCta, "/contact"),
        secondaryCta: cta(s.secondaryCta, "/portfolio"),
        posterImage: img(s.posterImage, s.posterImageUrl),
        backgroundVideoUrl: str(s.backgroundVideoUrl) || undefined,
        showStats: s.showStats !== false,
        stats: ((s.stats as { value?: string; label?: string }[]) || []).map((st) => ({
          value: str(st.value),
          label: str(st.label),
        })),
      };
      return <Hero initialData={data} editPath={p} />;
    }
    case "logos": {
      const logos = ((s.items as Record<string, unknown>[]) || [])
        .map((it) => ({
          image: img(it.image, it.imageUrl) ?? "",
          name: str(it.name) || undefined,
          href: str(it.href) || undefined,
        }))
        .filter((it) => it.image);
      return <LogoMarquee eyebrow={str(s.eyebrow) || undefined} items={logos} editPath={p} />;
    }
    case "capabilities": {
      const items = ((s.items as Record<string, unknown>[]) || []).map((it) => ({
        image: img(it.image, it.imageUrl) ?? "",
        eyebrow: str(it.eyebrow),
        title: str(it.title),
        text: str(it.text),
        href: str(it.href) || "/services",
      }));
      if (!items.length) return null;
      return <CapabilitiesShowcase eyebrow={str(s.eyebrow)} items={items} editPath={p} />;
    }
    case "services":
      return <ServicesGrid heading={heading(s)} editPath={p} />;
    case "process": {
      const steps = ((s.steps as { title?: string; description?: string }[]) || []).map((st) => ({
        title: str(st.title),
        description: str(st.description),
      }));
      return (
        <Process
          eyebrow={str(s.eyebrow)}
          title={str(s.title)}
          description={str(s.description) || undefined}
          steps={steps}
          editPath={p}
        />
      );
    }
    case "caseStudies":
      if (!ctx.caseStudies.length) return null;
      return <CaseStudiesTabs studies={ctx.caseStudies} heading={heading(s)} editPath={p} />;
    case "showcase":
      if (!ctx.projects.length) return null;
      return <HorizontalShowcase projects={ctx.projects} heading={heading(s)} editPath={p} />;
    case "team":
      return <FeaturedTeam heading={heading(s)} editPath={p} />;
    case "statsStrip":
      return (
        <Stats
          items={((s.stats as { value?: string; label?: string }[]) || []).map((st) => ({
            value: str(st.value),
            label: str(st.label),
          }))}
        />
      );
    case "cta":
      return (
        <CTASection
          title={str(s.title)}
          description={str(s.description)}
          primary={{ label: str(s.buttonLabel), href: str(s.buttonHref) || "/contact" }}
          editPath={p}
        />
      );
    case "contact":
      return (
        <ContactTeaser
          eyebrow={str(s.eyebrow) || undefined}
          title={str(s.title)}
          description={str(s.description) || undefined}
          editPath={p}
        />
      );
    case "textBlock":
      return (
        <TextBlock
          eyebrow={str(s.eyebrow) || undefined}
          title={str(s.title)}
          description={str(s.description) || undefined}
          align={s.align === "left" ? "left" : "center"}
          editPath={p}
        />
      );
    case "imageText":
      return (
        <ImageText
          image={img(s.image, s.imageUrl)}
          eyebrow={str(s.eyebrow) || undefined}
          title={str(s.title)}
          description={str(s.description) || undefined}
          buttonLabel={str(s.buttonLabel) || undefined}
          buttonHref={str(s.buttonHref) || undefined}
          imagePosition={s.imagePosition === "left" ? "left" : "right"}
          editPath={p}
        />
      );
    default:
      return null;
  }
}

export async function HomeRenderer({ sections }: { sections: HomeSection[] }) {
  const visible = sections.filter((s) => !s.hidden);
  const [projects, caseStudies] = await Promise.all([
    visible.some((s) => s.type === "showcase") ? getProjects() : Promise.resolve([]),
    visible.some((s) => s.type === "caseStudies") ? getCaseStudies() : Promise.resolve([]),
  ]);
  const ctx: Ctx = { projects, caseStudies };

  return (
    <>
      {sections.map((s, i) => {
        if (s.hidden) return null;
        const node = renderSection(s, i, ctx);
        if (!node) return null;
        return (
          <SectionShell key={s.id ?? `${s.type}-${i}`} index={i} label={blockLabel(s.type)} icon={blockIcon(s.type)}>
            {node}
          </SectionShell>
        );
      })}
    </>
  );
}
