import Image from "next/image";
import type { ReactNode } from "react";
import { BrandShape } from "@/components/atoms/brand-shape";
import { markShapes } from "@/components/atoms/logo-shapes";
import { cn } from "@/lib/style/cn";

type RecordPosterProps = {
  posterUrl: string;
  noPosterLabel: string;
  sizes: string;
  badge?: ReactNode;
  className?: string;
};

function PosterPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center bg-header">
      <BrandShape
        shapes={markShapes}
        label={label}
        ringClassName="fill-primary/60"
        glyphClassName="fill-foreground/20"
        className="w-3/5"
      />
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
        <PosterPlaceholder label={noPosterLabel} />
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
