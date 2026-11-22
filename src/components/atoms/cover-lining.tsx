export function CoverLining() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 size-full rounded-[inherit] opacity-18 mix-blend-multiply"
    >
      <filter id="cover-lining-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix values="0 0 0 0 0.2 0 0 0 0 0.12 0 0 0 0 0.06 0 0 0 0.9 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#cover-lining-grain)" />
    </svg>
  );
}
