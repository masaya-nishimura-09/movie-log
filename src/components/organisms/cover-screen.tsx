import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/atoms/logo";
import { MaskingTape } from "@/components/atoms/masking-tape";
import { cn } from "@/lib/style/cn";
import { paperCard, ruledLines } from "@/lib/style/paper";

type CoverScreenProps = {
  homeHref: string;
  brandName: string;
  wide?: boolean;
  children: ReactNode;
};

export function CoverScreen({
  homeHref,
  brandName,
  wide = false,
  children,
}: CoverScreenProps) {
  return (
    <main className="flex flex-1 items-center justify-center bg-background px-4 py-6 md:px-8 md:py-10">
      <div
        className={cn(
          "relative flex min-h-[calc(100svh-3rem)] w-full flex-col items-center justify-center rounded-[4px_14px_14px_4px] bg-cover px-4 py-10 shadow-[inset_0_1px_0_rgb(255_255_255/0.12),inset_0_-2px_0_rgb(0_0_0/0.15),0_24px_48px_rgb(10_41_71/0.22)] md:min-h-195 md:rounded-[4px_18px_18px_4px] md:px-12 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),inset_0_-2px_0_rgb(0_0_0/0.15),0_24px_48px_rgb(0_0_0/0.35)]",
          wide ? "max-w-220 md:py-12" : "max-w-140",
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-4.5 rounded-l-[inherit] bg-[linear-gradient(to_right,rgb(0_0_0/0.22),rgb(0_0_0/0.06)_40%,transparent)] md:w-6"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-4.5 w-0.75 bg-[linear-gradient(to_right,rgb(0_0_0/0.22),rgb(255_255_255/0.1))] md:left-6"
        />
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
        <div className="relative mb-7 text-center [--foreground:#f3e4c9] [--logo-ring:#d9b48a]">
          <Link
            href={homeHref}
            className="rounded-sm outline-none focus-visible:ring-(--beige) focus-visible:ring-2"
          >
            <Logo name={brandName} className="h-10 md:h-12" />
          </Link>
        </div>
        <div
          className={cn(
            paperCard,
            ruledLines,
            wide ? "max-w-180" : "max-w-100",
          )}
        >
          <MaskingTape className="w-24" />
          {children}
        </div>
      </div>
    </main>
  );
}
