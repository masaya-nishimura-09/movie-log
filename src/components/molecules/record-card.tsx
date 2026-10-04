import { ImageOff } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ScoreBadge } from "@/components/atoms/score-badge";
import { RecordPoster } from "@/components/molecules/record-poster";
import type { Score } from "@/schemas/record/enums";

type RecordCardProps = {
  href: string;
  title: string;
  posterUrl: string;
  score: Score;
  scoreLabel: string;
  year: string;
  platformLabel: string;
  meta: ReactNode;
  watchedLabel: ReactNode;
  watchedStamp: ReactNode;
  noPosterLabel: string;
};

export function RecordCard({
  href,
  title,
  posterUrl,
  score,
  scoreLabel,
  year,
  platformLabel,
  meta,
  watchedLabel,
  watchedStamp,
  noPosterLabel,
}: RecordCardProps) {
  const hasPoster = posterUrl !== "";

  return (
    <Link
      href={href}
      className="group relative flex w-full flex-col rounded-[14px] border bg-card outline-none transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99]"
    >
      <RecordPoster
        title={title}
        posterUrl={posterUrl}
        year={year}
        platformLabel={platformLabel}
        size="card"
        sizes="(min-width: 768px) 190px, 50vw"
        className="rounded-t-[13px]"
        badge={<ScoreBadge score={score} size="sm" label={scoreLabel} />}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -top-px -left-px size-0 bg-background transition-all duration-200 [clip-path:polygon(0_0,100%_0,0_100%)] group-hover:size-[28px]"
      />
      <svg
        aria-hidden="true"
        role="presentation"
        viewBox="0 0 19 19"
        className="pointer-events-none absolute -top-px -left-px size-0 fill-secondary transition-all duration-200 [filter:drop-shadow(2px_2px_2px_rgb(0_0_0/0.3))] group-hover:size-[28px]"
      >
        <path d="M18 1 L1 18 Q0 19 2 19 L11 19 A8 8 0 0 0 19 11 L19 2 Q19 0 18 1 Z" />
      </svg>
      <div aria-hidden className="relative h-0">
        <div className="absolute inset-x-3 top-0 border-input border-t border-dashed" />
        <span className="absolute -top-2 -left-[9px] size-4 rounded-full border bg-background [clip-path:inset(0_0_0_50%)]" />
        <span className="absolute -top-2 -right-[9px] size-4 rounded-full border bg-background [clip-path:inset(0_50%_0_0)]" />
      </div>
      {hasPoster ? (
        <div className="flex flex-1 flex-col gap-1.25 px-3 py-2.75">
          <span className="text-pretty font-bold text-foreground text-sm leading-[1.4]">
            {title}
          </span>
          <div className="flex items-center justify-between gap-2">
            <span className="min-w-0 truncate text-[11px] text-muted-foreground">
              {meta}
            </span>
            <span className="shrink-0 -rotate-6 rounded-sm border-2 border-primary/60 px-1.5 py-px font-bold text-[10px] text-primary/80 tabular-nums tracking-wider">
              {watchedStamp}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-between gap-2 px-3 py-2.75">
          <span className="text-[11px] text-muted-foreground">
            {watchedLabel}
          </span>
          <ImageOff
            className="size-3.75 text-muted-foreground"
            aria-label={noPosterLabel}
          />
        </div>
      )}
    </Link>
  );
}
