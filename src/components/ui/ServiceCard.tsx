import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getLocale } from "@/lib/getLocale";
import { ItemPencil } from "@/components/edit/ItemPencil";
import { getUI } from "@/lib/i18n";
import type { Service } from "@/content/types";

export async function ServiceCard({ service }: { service: Service }) {
  const t = getUI(await getLocale());
  const Icon = service.icon;
  return (
    <Link
      href={`/services/${service.slug}`}
      className="hover-lift group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {/* Image header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-tint">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/10 to-transparent" />
        <ItemPencil collection="services" id={service.id} label={service.title} />
        {/* Cyan icon chip overlapping the image */}
        <span className="absolute -bottom-5 left-6 inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] bg-accent text-accent-contrast shadow">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 pt-8">
        <h3 className="text-lg">{service.title}</h3>
        <p className="mt-2 flex-1 text-sm">{service.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
          {t.buttons.learnMore}
          <ArrowRight className="h-4 w-4 transition-transform duration-[var(--dur-fast)] ease-soft group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
