import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { getProjects } from "@/lib/cms";

export async function FeaturedProjects() {
  const projects = await getProjects();
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Selected work"
          title="Projects we're proud of"
          description="A glimpse of recent work across commerce, mobile, dashboards and brand."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.05}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/portfolio" variant="ghost">
            View all projects
          </Button>
        </div>
      </Container>
    </section>
  );
}
