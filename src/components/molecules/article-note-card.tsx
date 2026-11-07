import Link from "next/link";
import type { ReactNode } from "react";
import { MaskingTape } from "@/components/atoms/masking-tape";
import { RecordPoster } from "@/components/molecules/record-poster";
import { cn } from "@/lib/style/cn";

type ArticleNoteCardProps = {
  href: string;
  title: string;
  date: ReactNode;
  movie?: {
    title: string;
    posterUrl: string;
    noPosterLabel: string;
  };
};

export function ArticleNoteCard({
  href,
  title,
  date,
  movie,
}: ArticleNoteCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col rounded-[3px] bg-[position:0_12px] bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_27px,var(--color-input)_27px,var(--color-input)_28px)] bg-card py-3 pl-5 shadow-[0_6px_14px_-8px_rgb(10_41_71/0.45)] outline-none transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_20px_-10px_rgb(10_41_71/0.5)] focus-visible:ring-2 focus-visible:ring-ring",
        movie ? "pr-20" : "pr-5",
      )}
    >
      <span className="text-muted-foreground text-xs tabular-nums leading-7">
        {date}
      </span>
      <span className="line-clamp-2 min-h-14 font-bold text-foreground text-lg leading-7">
        {title}
      </span>
      {movie && (
        <>
          <span className="mt-auto truncate text-foreground-sub text-xs leading-7">
            {movie.title}
          </span>
          <span className="absolute top-4 right-4 w-11 rotate-3">
            <RecordPoster
              posterUrl={movie.posterUrl}
              noPosterLabel={movie.noPosterLabel}
              sizes="44px"
              className="rounded-[2px] shadow-[0_3px_6px_-3px_rgb(10_41_71/0.5)]"
            />
            <MaskingTape className="-top-1.5 h-3 w-8 -rotate-6" />
          </span>
        </>
      )}
    </Link>
  );
}
