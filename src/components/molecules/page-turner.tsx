import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/style/cn";

type Turn = (() => void) | string | undefined;

type PageTurnerProps = {
  label: string;
  prevLabel: string;
  nextLabel: string;
  prev: Turn;
  next: Turn;
  className?: string;
};

const arrow =
  "grid size-11 place-items-center rounded-[10px] text-foreground outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-35 lg:size-10";

function TurnButton({
  turn,
  label,
  children,
}: {
  turn: Turn;
  label: string;
  children: ReactNode;
}) {
  if (typeof turn === "string") {
    return (
      <Link href={turn} aria-label={label} className={arrow}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={turn}
      disabled={!turn}
      aria-label={label}
      className={arrow}
    >
      {children}
    </button>
  );
}

export function PageTurner({
  label,
  prevLabel,
  nextLabel,
  prev,
  next,
  className,
}: PageTurnerProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-[13px] text-foreground lg:gap-0.5 lg:text-foreground-sub",
        className,
      )}
    >
      <TurnButton turn={prev} label={prevLabel}>
        <ChevronLeft className="size-5 lg:size-4.5" aria-hidden />
      </TurnButton>
      <span aria-live="polite" className="min-w-14 text-center tabular-nums">
        {label}
      </span>
      <TurnButton turn={next} label={nextLabel}>
        <ChevronRight className="size-5 lg:size-4.5" aria-hidden />
      </TurnButton>
    </div>
  );
}
