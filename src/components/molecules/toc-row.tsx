import Link from "next/link";
import type { ReactNode } from "react";
import { StarRating } from "@/components/atoms/star-rating";
import { RecordPoster } from "@/components/molecules/record-poster";

type TocRowProps = {
  href: string;
  title: string;
  posterUrl: string;
  noPosterLabel: string;
  meta: string;
  watched: ReactNode;
  score: number;
  scoreLabel: string;
};

export function TocRow({
  href,
  title,
  posterUrl,
  noPosterLabel,
  meta,
  watched,
  score,
  scoreLabel,
}: TocRowProps) {
  return (
    <Link
      href={href}
      className="group flex h-14 items-center gap-2.5 text-paper-ink outline-none focus-visible:ring-2 focus-visible:ring-ring lg:-mx-2.5 lg:gap-3 lg:rounded-md lg:px-2.5 lg:hover:bg-[rgb(139_94_60/0.1)]"
    >
      <RecordPoster
        posterUrl={posterUrl}
        noPosterLabel={noPosterLabel}
        sizes="32px"
        className="aspect-auto h-11 w-7.5 shrink-0 shadow-[0_2px_6px_rgb(10_41_71/0.18)] lg:h-11.5 lg:w-8"
      />
      <span className="flex min-w-0 flex-1 flex-col leading-5.5 lg:max-w-60 lg:flex-none lg:leading-6">
        <span className="truncate font-bold font-display text-sm underline-offset-3 group-hover:underline group-hover:decoration-[rgb(139_94_60/0.6)] lg:text-[15px]">
          {title}
        </span>
        <span className="flex items-center gap-1.5 whitespace-nowrap text-[11px] text-paper-muted lg:leading-4.5">
          <StarRating
            score={score}
            label={scoreLabel}
            className="gap-px text-[11px] lg:hidden"
          />
          <span>
            {meta && <span className="hidden lg:inline">{meta} · </span>}
            {watched}
          </span>
        </span>
      </span>
      <span
        aria-hidden="true"
        className="mx-0.5 hidden min-w-4 flex-1 translate-y-1.25 border-[rgb(10_41_71/0.25)] border-b-2 border-dotted lg:block"
      />
      <StarRating
        score={score}
        label={scoreLabel}
        className="hidden gap-0.5 text-[11px] lg:inline-flex"
      />
    </Link>
  );
}
