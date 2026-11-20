import { cn } from "@/lib/style/cn";

type StarRatingProps = {
  score: number;
  label: string;
  max?: number;
  className?: string;
};

const starPath =
  "m12 3.5 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z";

export function StarRating({
  score,
  label,
  max = 5,
  className,
}: StarRatingProps) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cn(
        "inline-flex gap-0.75 align-middle text-primary",
        className,
      )}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <svg
          key={star}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="block size-[1em]"
          fill={star <= score ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinejoin="round"
        >
          <path d={starPath} />
        </svg>
      ))}
    </span>
  );
}
