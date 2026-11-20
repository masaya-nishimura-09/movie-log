import type { ReactNode } from "react";
import { NotebookRing } from "@/components/atoms/notebook-ring";
import { cn } from "@/lib/style/cn";

type RingNotebookProps = {
  variant: "spread" | "single";
  children: ReactNode;
  className?: string;
};

function Rings({
  variant,
  className,
}: {
  variant: "spread" | "edge";
  className: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-10 flex flex-col",
        variant === "spread" ? "gap-2.5" : "gap-3",
        className,
      )}
    >
      <NotebookRing variant={variant} />
      <NotebookRing variant={variant} />
      <NotebookRing variant={variant} />
    </div>
  );
}

export function RingNotebook({
  variant,
  children,
  className,
}: RingNotebookProps) {
  if (variant === "single") {
    return (
      <div
        className={cn(
          "relative pt-2.5 pr-5 pb-3 pl-10 drop-shadow-[0_12px_18px_rgb(10_41_71/0.14)]",
          className,
        )}
      >
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-2 left-6.5 rounded-[3px_14px_14px_3px] bg-cover shadow-[inset_0_1px_0_rgb(255_255_255/0.12),inset_0_-2px_0_rgb(0_0_0/0.15),inset_4px_0_0_rgb(0_0_0/0.16)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-2 left-6.5 overflow-hidden"
        >
          <svg
            aria-hidden="true"
            fill="none"
            className="absolute top-0 -left-6 h-full w-[calc(100%+24px)]"
          >
            <rect
              x="6"
              y="5.5"
              rx="9"
              className="h-[calc(100%-12px)] w-[calc(100%-12px)]"
              stroke="#d9b48a"
              strokeOpacity="0.6"
              strokeWidth="1.5"
              strokeDasharray="5 4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        {children}
        <Rings variant="edge" className="top-17.5 left-1.5" />
        <Rings variant="edge" className="bottom-17.5 left-1.5" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex gap-1 rounded-[14px] bg-cover px-5 pt-3.5 pb-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.12),inset_0_-2px_0_rgb(0_0_0/0.15),0_24px_48px_rgb(10_41_71/0.16)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),inset_0_-2px_0_rgb(0_0_0/0.15),0_24px_48px_rgb(0_0_0/0.35)]",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full rounded-[14px] opacity-18 mix-blend-multiply"
      >
        <filter id="notebook-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix values="0 0 0 0 0.2 0 0 0 0 0.12 0 0 0 0 0.06 0 0 0 0.9 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#notebook-grain)" />
      </svg>
      <svg
        aria-hidden="true"
        fill="none"
        className="pointer-events-none absolute inset-0 size-full"
      >
        <rect
          x="7.5"
          y="6.5"
          rx="9"
          className="h-[calc(100%-15px)] w-[calc(100%-15px)]"
          stroke="rgb(0 0 0 / 0.2)"
          strokeWidth="1"
        />
        <rect
          x="7"
          y="6"
          rx="9"
          className="h-[calc(100%-15px)] w-[calc(100%-15px)]"
          stroke="rgb(255 255 255 / 0.1)"
          strokeWidth="1"
        />
        <rect
          x="7"
          y="6.5"
          rx="9"
          className="h-[calc(100%-14px)] w-[calc(100%-14px)]"
          stroke="#d9b48a"
          strokeOpacity="0.6"
          strokeWidth="1.6"
          strokeDasharray="5 4"
          strokeLinecap="round"
        />
      </svg>
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-[calc(50%-12px)] w-6 bg-black/10 shadow-[inset_1px_0_0_rgb(0_0_0/0.12),inset_-1px_0_0_rgb(0_0_0/0.12)]"
      />
      {children}
      <Rings variant="spread" className="top-24 left-[calc(50%-39px)]" />
      <Rings variant="spread" className="bottom-24 left-[calc(50%-39px)]" />
    </div>
  );
}
