import { cva } from "class-variance-authority";
import { cn } from "@/lib/style/cn";
import type { Score } from "@/schemas/record/enums";

const scoreBadgeVariants = cva(
  "inline-flex shrink-0 flex-col items-center justify-center font-bold tabular-nums leading-none",
  {
    variants: {
      size: {
        sm: "h-6.5 min-w-6.5 rounded-[8px] px-1.75 text-[13px]",
        md: "size-13 gap-0.5 rounded-2xl text-2xl",
        lg: "size-18 gap-1 rounded-[20px] text-3xl",
      },
      tone: {
        top: "bg-primary text-primary-foreground",
        high: "bg-score-high text-score-high-foreground",
        plain: "bg-score-low text-score-low-foreground",
      },
    },
  },
);

function toneOf(score: Score) {
  if (score === 5) return "top";
  if (score === 4) return "high";
  return "plain";
}

type ScoreBadgeProps = {
  score: Score;
  size: "sm" | "md" | "lg";
  label: string;
  caption?: string;
  className?: string;
};

export function ScoreBadge({
  score,
  size,
  label,
  caption,
  className,
}: ScoreBadgeProps) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cn(
        scoreBadgeVariants({ size, tone: toneOf(score) }),
        className,
      )}
    >
      {score}
      {caption && (
        <span className="font-normal text-[10px] tracking-[0.08em] opacity-85 md:text-[11px]">
          {caption}
        </span>
      )}
    </span>
  );
}
