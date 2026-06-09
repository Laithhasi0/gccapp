import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { TeamCard } from "@/components/ui/TeamCard";
import { Reveal } from "@/components/motion/Reveal";
import { getFeaturedTeam } from "@/lib/getTeam";

/** Home-page variant: featured people + "Meet the team" link. */
export async function FeaturedTeam() {
  const members = await getFeaturedTeam(4);
  if (!members.length) return null;

  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Our people"
          title="The team behind the work"
          description="A senior, close-knit team of designers, engineers and strategists."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.05}>
              <TeamCard member={member} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/about#team" variant="ghost">
            Meet the team
          </Button>
        </div>
      </Container>
    </section>
  );
}
