import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { CTASection } from "@/components/ui/CTASection";
import { Editable } from "@/components/edit/Editable";
import { Check, ArrowLeft } from "lucide-react";
import { getService } from "@/lib/cms";
import { getLocale } from "@/lib/getLocale";
import { getUI } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.seoDescription,
  };
}

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const Icon = service.icon;
  const t = getUI(await getLocale());

  return (
    <Editable href="/admin/collections/services" label="this service">
      <Section>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" /> {t.pages.serviceDetail.allServices}
        </Link>
        <div className="mt-8 grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-sm)] bg-accent-soft text-accent">
              <Icon className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <Badge className="ml-3 align-middle">{t.pages.serviceDetail.service}</Badge>
            <h1 className="mt-5">{service.title}</h1>
            <p className="mt-5 text-lg">{service.excerpt}</p>
            <div className="mt-7">
              <Button href="/contact">{t.pages.serviceDetail.discussProject}</Button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-sm">
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-5">
            {service.body.map((para) => (
              <p key={para} className="text-ink/90">
                {para}
              </p>
            ))}
          </div>
          <div>
            <h3 className="text-xl">{t.pages.serviceDetail.whatsIncluded}</h3>
            <ul className="mt-5 space-y-3">
              {service.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-ink">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CTASection />
    </Editable>
  );
}
