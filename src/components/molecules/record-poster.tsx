import Image from "next/image";
import type { ReactNode } from "react";
import { StampShapes } from "@/components/atoms/stamp-shapes";
import { cn } from "@/lib/style/cn";

type RecordPosterProps = {
  posterUrl: string;
  noPosterLabel: string;
  sizes: string;
  badge?: ReactNode;
  className?: string;
};

function StampPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center bg-header">
      <svg
        viewBox="0 0 110 110"
        role="img"
        aria-label={label}
        className="w-1/2"
      >
        <StampShapes
          stampClassName="fill-foreground/20"
          cClassName="fill-header"
          playClassName="fill-primary/60"
        />
      </svg>
    </div>
  );
}

export function RecordPoster({
  posterUrl,
  noPosterLabel,
  sizes,
  badge,
  className,
}: RecordPosterProps) {
  return (
    <div
      className={cn("relative aspect-2/3 w-full overflow-hidden", className)}
    >
      {posterUrl === "" ? (
        <StampPlaceholder label={noPosterLabel} />
      ) : (
        <Image
          src={posterUrl}
          alt=""
          fill
          sizes={sizes}
          unoptimized={!posterUrl.startsWith("https://image.tmdb.org/")}
          className="object-cover"
        />
      )}
      {badge && <div className="absolute top-2.75 right-2.75">{badge}</div>}
    </div>
  );
}
