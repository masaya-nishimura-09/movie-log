import Link from "next/link";
import { RecordPoster } from "@/components/molecules/record-poster";
import { cn } from "@/lib/style/cn";

export type ArticleRecordCardProps = {
  href: string;
  title: string;
  posterUrl: string;
  noPosterLabel: string;
  year: string;
  className?: string;
};

export function ArticleRecordCard({
  href,
  title,
  posterUrl,
  noPosterLabel,
  year,
  className,
}: ArticleRecordCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "-m-1.5 flex items-center gap-3.5 rounded-xl p-1.5 outline-none transition-colors hover:bg-secondary/60 focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <RecordPoster
        posterUrl={posterUrl}
        noPosterLabel={noPosterLabel}
        sizes="64px"
        className="w-16 shrink-0 rounded-lg shadow-[0_2px_8px_rgb(0_0_0/0.2)] ring-1 ring-foreground/10"
      />
      <span className="flex min-w-0 flex-col gap-1">
        <span className="line-clamp-3 break-words font-bold text-[15px] text-foreground leading-snug">
          {title}
        </span>
        {year !== "" && (
          <span className="text-muted-foreground text-xs">{year}</span>
        )}
      </span>
    </Link>
  );
}
