import Image from "next/image";

/**
 * Fixed, full-page ambient tech background: a glowing circuit-board image
 * (responsive desktop / mobile) with a clean dark centre for readability, plus
 * slowly drifting cyan glows. Sits behind all content (chrome uses z-10).
 * Reduced-motion safe — the global media query halts the glow keyframes.
 */
export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Circuit-board imagery — detail at the edges, dark in the middle */}
      <Image
        src="/media/images/tech-bg-wide.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hidden object-cover opacity-60 md:block"
      />
      <Image
        src="/media/images/tech-bg-tall.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-60 md:hidden"
      />

      {/* Keep the header area and content centre clean */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/55 to-background/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_42%,var(--background),transparent_75%)]" />

      {/* Drifting ambient glows on top */}
      <div
        className="glow absolute -top-48 left-[20%] h-[36rem] w-[36rem] opacity-50"
        style={{ animation: "drift-a 20s ease-in-out infinite" }}
      />
      <div
        className="glow absolute top-1/3 -right-40 h-[42rem] w-[42rem] opacity-35"
        style={{ animation: "drift-b 26s ease-in-out infinite" }}
      />
    </div>
  );
}
