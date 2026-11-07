import Link from "next/link";
import type { ReactNode } from "react";
import { MaskingTape } from "@/components/atoms/masking-tape";
import { ScoreBadge } from "@/components/atoms/score-badge";
import { RecordPoster } from "@/components/molecules/record-poster";
import type { Score } from "@/schemas/record/enums";

type RecordCardProps = {
  href: string;
  title: string;
  posterUrl: string;
  score: Score;
  scoreLabel: string;
  meta: ReactNode;
  watchedStamp: ReactNode;
  noPosterLabel: string;
};

export function RecordCard({
  href,
  title,
  posterUrl,
  score,
  scoreLabel,
  meta,
  watchedStamp,
  noPosterLabel,
}: RecordCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex w-full flex-col gap-2.5 rounded-md pt-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <div className="relative transition-transform duration-200 group-hover:-translate-y-1 group-active:translate-y-0">
        <RecordPoster
          posterUrl={posterUrl}
          noPosterLabel={noPosterLabel}
          sizes="(min-width: 768px) 190px, 50vw"
          className="rounded-[3px] shadow-[0_6px_14px_-8px_rgb(10_41_71/0.55)] transition-shadow duration-200 group-hover:shadow-[0_14px_22px_-10px_rgb(10_41_71/0.6)]"
          badge={<ScoreBadge score={score} size="sm" label={scoreLabel} />}
        />
        <MaskingTape className="in-[li:nth-child(3n)]:-rotate-1 in-[li:nth-child(3n+2)]:rotate-2" />
      </div>
      <div className="flex flex-col gap-1 px-0.5">
        <span className="line-clamp-2 h-[2lh] text-pretty font-bold text-foreground text-sm leading-[1.4]">
          {title}
        </span>
        <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <span className="min-w-0 truncate">{meta}</span>
          <span className="shrink-0 tabular-nums">{watchedStamp}</span>
        </div>
      </div>
    </Link>
  );
}
