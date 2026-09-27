import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/style/cn";

type RecordPosterProps = {
  title: string;
  posterUrl: string;
  year: string;
  platformLabel: string;
  sizes: string;
  size: "card" | "detail";
  badge?: ReactNode;
  className?: string;
};

const titleSizes = {
  card: { short: "text-[21px]", long: "text-[17px]" },
  detail: {
    short: "text-base md:text-[28px]",
    long: "text-[13px] md:text-[22px]",
  },
};

export function RecordPoster({
  title,
  posterUrl,
  year,
  platformLabel,
  sizes,
  size,
  badge,
  className,
}: RecordPosterProps) {
  const titleSize =
    titleSizes[size][Array.from(title).length > 12 ? "long" : "short"];

  return (
    <div
      className={cn("relative aspect-2/3 w-full overflow-hidden", className)}
    >
      {posterUrl === "" ? (
        <div className="flex h-full flex-col justify-between bg-header p-3.25">
          <span className="font-mono text-[11px] text-accent-foreground tracking-[0.08em]">
            {year}
          </span>
          <span
            className={cn(
              "text-pretty font-bold font-heading text-foreground leading-[1.3]",
              titleSize,
            )}
          >
            {title}
          </span>
          <span className="truncate font-mono text-[11px] text-foreground-sub tracking-[0.04em]">
            {platformLabel}
          </span>
        </div>
      ) : (
        <Image
          src={posterUrl}
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
        />
      )}
      {badge && <div className="absolute top-2.75 right-2.75">{badge}</div>}
    </div>
  );
}
