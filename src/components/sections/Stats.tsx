import { Container } from "@/components/ui/Container";
import { StatCounter } from "@/components/ui/StatCounter";
import { stats as seedStats } from "@/content/site";

const fallback = seedStats.map((s) => ({
  value: `${s.prefix ?? ""}${s.value}${s.suffix ?? ""}`,
  label: s.label,
}));

export function Stats({ items }: { items?: { value: string; label: string }[] }) {
  const data = items && items.length ? items : fallback;
  return (
    <section className="bg-surface-tint py-16 sm:py-20">
      <Container>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {data.map((stat) => (
            <StatCounter key={stat.label} stat={stat} />
          ))}
        </div>
      </Container>
    </section>
  );
}
