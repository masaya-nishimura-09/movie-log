import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/style/cn";

type PageTurnerProps = {
  label: string;
  prevLabel: string;
  nextLabel: string;
  onPrev?: () => void;
  onNext?: () => void;
  className?: string;
};

const arrow =
  "grid size-11 place-items-center rounded-[10px] text-foreground outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-35 lg:size-10";

export function PageTurner({
  label,
  prevLabel,
  nextLabel,
  onPrev,
  onNext,
  className,
}: PageTurnerProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-[13px] text-foreground lg:gap-0.5 lg:text-foreground-sub",
        className,
      )}
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={!onPrev}
        aria-label={prevLabel}
        className={arrow}
      >
        <ChevronLeft className="size-5 lg:size-4.5" aria-hidden />
      </button>
      <span aria-live="polite" className="min-w-14 text-center tabular-nums">
        {label}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={!onNext}
        aria-label={nextLabel}
        className={arrow}
      >
        <ChevronRight className="size-5 lg:size-4.5" aria-hidden />
      </button>
    </div>
  );
}
