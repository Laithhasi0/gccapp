import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Reveal } from "@/components/motion/Reveal";
import { getServices, type Heading } from "@/lib/cms";

export async function ServicesGrid({ heading, editPath }: { heading?: Heading; editPath?: string }) {
  const services = await getServices();
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow={heading?.eyebrow ?? "What we do"}
          title={heading?.title ?? "Services built around outcomes"}
          description={heading?.description ?? "From first idea to launch and growth, we cover the full digital product lifecycle."}
          editPath={editPath}
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.05}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
