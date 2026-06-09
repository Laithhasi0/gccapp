import { Section } from "@/components/ui/Section";

type Block = { heading: string; body: string[] };

export function LegalPage({
  title,
  updated,
  intro,
  blocks,
}: {
  title: string;
  updated: string;
  intro: string;
  blocks: Block[];
}) {
  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <h1>{title}</h1>
        <p className="mt-3 text-sm text-muted">Last updated: {updated}</p>
        <p className="mt-6 text-lg">{intro}</p>
        <div className="mt-10 space-y-8">
          {blocks.map((b) => (
            <section key={b.heading}>
              <h2 className="text-xl">{b.heading}</h2>
              {b.body.map((p, i) => (
                <p key={i} className="mt-3 text-ink/90">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </Section>
  );
}
