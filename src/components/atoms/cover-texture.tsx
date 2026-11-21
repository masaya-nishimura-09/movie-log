export function CoverTexture() {
  return (
    <>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full rounded-[inherit] opacity-18 mix-blend-multiply"
      >
        <filter id="cover-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix values="0 0 0 0 0.2 0 0 0 0 0.12 0 0 0 0 0.06 0 0 0 0.9 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cover-grain)" />
      </svg>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        <svg
          aria-hidden="true"
          fill="none"
          className="absolute top-0 -left-7.5 h-full w-[calc(100%+30px)]"
        >
          <rect
            x="9"
            y="9"
            rx="12"
            className="h-[calc(100%-18px)] w-[calc(100%-18px)]"
            stroke="#d9b48a"
            strokeOpacity="0.6"
            strokeWidth="1.6"
            strokeDasharray="5 4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </>
  );
}
