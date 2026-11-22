import Link from "next/link";
import type { ReactNode } from "react";
import { BrandShape } from "@/components/atoms/brand-shape";
import { wordmarkShapes } from "@/components/atoms/logo-shapes";
import { RingNotebook } from "@/components/organisms/ring-notebook";

type InsideCoverScreenProps = {
  homeHref: string;
  brandName: string;
  title: string;
  description: ReactNode;
  pocket: ReactNode;
  credits: ReactNode;
  footer: ReactNode;
};

function Wordmark({
  homeHref,
  brandName,
  foil,
}: {
  homeHref: string;
  brandName: string;
  foil: boolean;
}) {
  return (
    <Link
      href={homeHref}
      className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <BrandShape
        shapes={wordmarkShapes}
        label={brandName}
        ringClassName={foil ? "fill-[#d8b679]" : "fill-(--logo-ring)"}
        glyphClassName={foil ? "fill-[#f1e3c8]" : "fill-foreground"}
        className="h-12 w-auto"
      />
    </Link>
  );
}

function LeatherGrain() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full rounded-[inherit] opacity-18 mix-blend-multiply"
    >
      <filter id="inside-cover-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix values="0 0 0 0 0.2 0 0 0 0 0.12 0 0 0 0 0.06 0 0 0 0.9 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#inside-cover-grain)" />
    </svg>
  );
}

export function InsideCoverScreen({
  homeHref,
  brandName,
  title,
  description,
  pocket,
  credits,
  footer,
}: InsideCoverScreenProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-background px-4 py-8 md:px-8 md:py-12">
      <h1 className="sr-only">{title}</h1>
      <RingNotebook
        variant="responsive"
        mirrored
        className="h-auto max-w-110 max-lg:self-stretch lg:w-full lg:max-w-220"
      >
        <div className="relative isolate flex min-h-84 flex-col items-center overflow-hidden rounded-[3px] bg-cover px-7 pt-11 pb-6 text-[#f1e3c8] lg:min-h-140 lg:min-w-0 lg:flex-1 lg:basis-0 lg:justify-center lg:rounded-[2px] lg:px-12">
          <LeatherGrain />
          <div className="relative flex flex-col items-center lg:hidden">
            <Wordmark homeHref={homeHref} brandName={brandName} foil />
            <p className="mt-4.5 text-center text-[13px] text-[rgb(241_227_200/0.85)] leading-6">
              {description}
            </p>
          </div>
          <div className="relative w-full">{pocket}</div>
          <div className="relative mt-4.5 w-full text-center">{credits}</div>
        </div>
        <div className="paper-theme relative z-2 hidden min-w-0 flex-1 basis-0 flex-col items-center justify-center rounded-[2px] bg-paper px-12 text-paper-ink lg:flex">
          <Wordmark homeHref={homeHref} brandName={brandName} foil={false} />
          <p className="mt-4.5 text-center text-[13px] text-paper-muted leading-7">
            {description}
          </p>
        </div>
      </RingNotebook>
      {footer}
    </main>
  );
}
