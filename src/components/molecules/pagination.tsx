import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/atoms/button";
import { cn } from "@/lib/style/cn";

type PaginationProps = {
  previousHref: string | undefined;
  nextHref: string | undefined;
  status: string;
  previousLabel: string;
  nextLabel: string;
};

export function Pagination({
  previousHref,
  nextHref,
  status,
  previousLabel,
  nextLabel,
}: PaginationProps) {
  const disabled = "pointer-events-none opacity-40";

  return (
    <nav className="flex items-center justify-center gap-3">
      <Link
        href={previousHref ?? "#"}
        aria-label={previousLabel}
        aria-disabled={previousHref === undefined}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          previousHref === undefined && disabled,
        )}
      >
        <ChevronLeft aria-hidden />
      </Link>
      <span className="text-muted-foreground text-sm tabular-nums">
        {status}
      </span>
      <Link
        href={nextHref ?? "#"}
        aria-label={nextLabel}
        aria-disabled={nextHref === undefined}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          nextHref === undefined && disabled,
        )}
      >
        <ChevronRight aria-hidden />
      </Link>
    </nav>
  );
}
