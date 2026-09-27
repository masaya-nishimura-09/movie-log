import { ImageOff } from "lucide-react";
import Link from "next/link";
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
  meta: string;
  watchedLabel: string;
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
  noPosterLabel,
}: RecordCardProps) {
  const hasPoster = posterUrl !== "";

  return (
    <Link
      href={href}
      className="flex w-full flex-col overflow-hidden rounded-[14px] border bg-card shadow-[0_2px_6px_-4px_rgb(10_41_71/0.14)] outline-none transition-shadow hover:shadow-[0_10px_24px_-14px_rgb(10_41_71/0.35)] focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RecordPoster
        title={title}
        posterUrl={posterUrl}
        year={year}
        platformLabel={platformLabel}
        size="card"
        sizes="(min-width: 768px) 190px, 50vw"
        className={hasPoster ? undefined : "border-b"}
        badge={<ScoreBadge score={score} size="sm" label={scoreLabel} />}
      />
      {hasPoster ? (
        <div className="flex flex-1 flex-col gap-1.25 px-3 py-2.75">
          <span className="text-pretty font-bold font-heading text-foreground text-sm leading-[1.4]">
            {title}
          </span>
          <span className="text-[11px] text-muted-foreground">{meta}</span>
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
