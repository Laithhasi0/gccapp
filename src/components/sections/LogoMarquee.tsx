"use client";

import Image from "next/image";
import { useEditMode } from "@/components/edit/EditProvider";
import { EditableText } from "@/components/edit/EditableText";

export type LogoItem = {
  image: string;
  name?: string;
  href?: string;
};

/**
 * "Client logos" section — an infinite horizontal marquee of logo cards.
 * Logos are managed entirely from the Visual Editor (upload, reorder, link).
 * Modern touches: soft white cards, faded edges, pause on hover, grayscale
 * that lifts to full colour on hover. RTL flips the scroll direction (CSS).
 * In edit mode it renders as a static row so cards are easy to select.
 */
export function LogoMarquee({
  eyebrow,
  items,
  editPath,
}: {
  eyebrow?: string;
  items: LogoItem[];
  editPath?: string;
}) {
  const edit = useEditMode();
  if (!items.length && !edit) return null;

  const eyebrowNode = editPath ? (
    <EditableText path={`${editPath}.eyebrow`} value={eyebrow} />
  ) : (
    eyebrow
  );

  const Card = ({ logo, idx }: { logo: LogoItem; idx: number }) => {
    const inner = (
      <span className="relative block h-10 w-32 sm:h-12 sm:w-40">
        <Image
          src={logo.image}
          alt={logo.name || `Client logo ${idx + 1}`}
          fill
          sizes="160px"
          className="object-contain"
        />
      </span>
    );
    const card =
      "flex h-24 w-48 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-white px-6 shadow-sm transition-all duration-300 " +
      "grayscale opacity-80 hover:grayscale-0 hover:opacity-100 hover:shadow-md hover:-translate-y-0.5";
    return logo.href && !edit ? (
      <a href={logo.href} target="_blank" rel="noreferrer" className={card} aria-label={logo.name}>
        {inner}
      </a>
    ) : (
      <span className={card}>{inner}</span>
    );
  };

  return (
    <section className="border-y border-border/50 bg-surface py-12 sm:py-14">
      {eyebrow !== undefined && (
        <p className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.22em] text-muted">
          {eyebrowNode}
        </p>
      )}

      {items.length === 0 ? (
        // Edit-mode placeholder until logos are added
        <div className="mx-auto flex max-w-xl items-center justify-center rounded-2xl border border-dashed border-border p-8 text-sm text-muted">
          Add your client logos in this section&apos;s settings →
        </div>
      ) : edit ? (
        // Static, selectable layout while editing
        <div className="flex flex-wrap items-center justify-center gap-5 px-5">
          {items.map((logo, i) => (
            <Card key={`${logo.image}-${i}`} logo={logo} idx={i} />
          ))}
        </div>
      ) : (
        <div
          className="group/marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
          dir="ltr"
        >
          <div
            className="animate-marquee flex w-max gap-5 pe-5 group-hover/marquee:[animation-play-state:paused]"
            style={{ "--marquee-duration": `${Math.max(20, items.length * 6)}s` } as React.CSSProperties}
          >
            {[...items, ...items].map((logo, i) => (
              <Card key={`${logo.image}-${i}`} logo={logo} idx={i % items.length} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
