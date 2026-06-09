import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Styleguide",
  description: "Design tokens, typography and primitives for GCC App.",
};

const swatches: { name: string; varName: string; ink?: boolean }[] = [
  { name: "background", varName: "--background" },
  { name: "surface", varName: "--surface" },
  { name: "surface-tint", varName: "--surface-tint" },
  { name: "border", varName: "--border" },
  { name: "ink", varName: "--ink", ink: true },
  { name: "muted", varName: "--muted", ink: true },
  { name: "accent", varName: "--accent", ink: true },
  { name: "accent-hover", varName: "--accent-hover", ink: true },
  { name: "accent-soft", varName: "--accent-soft" },
];

export default function Styleguide() {
  return (
    <Container className="py-14">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1>Styleguide</h1>
          <p className="mt-2">Cyan / white tech-services design system.</p>
        </div>
        <ThemeToggle />
      </div>

      {/* Colors */}
      <section className="mt-14">
        <h2>Colors</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {swatches.map((s) => (
            <div
              key={s.name}
              className="overflow-hidden rounded-[var(--radius)] border border-border shadow-sm"
            >
              <div
                className="h-20 w-full"
                style={{ background: `var(${s.varName})` }}
              />
              <div className="bg-surface px-3 py-2">
                <p className="font-mono text-xs text-ink">{s.name}</p>
                <p className="font-mono text-[0.7rem] text-muted">{s.varName}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="mt-14">
        <h2>Typography</h2>
        <div className="mt-6 space-y-4 rounded-[var(--radius-lg)] border border-border bg-surface p-8 shadow-sm">
          <h1>Heading 1 — Space Grotesk</h1>
          <h2>Heading 2 — display sans</h2>
          <h3>Heading 3 — display sans</h3>
          <h4>Heading 4 — display sans</h4>
          <p className="max-w-2xl text-lg text-ink">
            Body large — Inter. Airy, comfortable line-height for easy reading on a
            soft off-white canvas.
          </p>
          <p className="max-w-2xl">
            Body muted — secondary supporting copy in the muted tone, used for
            descriptions, captions and helper text throughout the site.
          </p>
          <p>
            <a href="#" className="text-accent underline-offset-4 hover:underline">
              An inline cyan link
            </a>{" "}
            sits comfortably inside a paragraph.
          </p>
        </div>
      </section>

      {/* Buttons */}
      <section className="mt-14">
        <h2>Buttons</h2>
        <div className="mt-6 space-y-6 rounded-[var(--radius-lg)] border border-border bg-surface p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="solid">Solid</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="link">Link</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
      </section>

      {/* Surfaces: radius + shadow */}
      <section className="mt-14 mb-8">
        <h2>Radius &amp; shadow</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[var(--radius-sm)] bg-surface p-6 shadow-sm">
            <p className="text-ink">radius-sm · shadow-sm</p>
          </div>
          <div className="rounded-[var(--radius)] bg-surface p-6 shadow">
            <p className="text-ink">radius · shadow</p>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-surface p-6 shadow-lg hover-lift">
            <p className="text-ink">radius-lg · shadow-lg · hover-lift</p>
          </div>
        </div>
      </section>
    </Container>
  );
}
