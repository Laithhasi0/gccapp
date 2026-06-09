import Image from "next/image";

/**
 * Static fallback for the scroll-driven 3D scene — a pre-rendered single frame
 * of the actual Three.js scene (see scripts/capture-3d-fallback.mjs). Shown on
 * reduced-motion / mobile, and as the loading state while the 3D bundle streams.
 * Transparent PNG-style alpha, so it sits cleanly on light or dark backgrounds.
 */
export function Scene3DFallback() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <div className="relative aspect-square w-[72vmin] max-w-[620px]">
        <Image
          src="/media/images/scene-3d-fallback.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 90vw, 620px"
          className="object-contain"
        />
      </div>
    </div>
  );
}
