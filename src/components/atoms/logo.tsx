import { wordmarkPath } from "@/components/atoms/logo-paths";
import { StampShapes } from "@/components/atoms/stamp-shapes";
import { cn } from "@/lib/style/cn";

export function Logo({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span className="inline-flex">
      <svg
        viewBox="0 0 634.9 110"
        aria-hidden="true"
        className={cn("h-6 w-auto", className)}
      >
        <StampShapes
          stampClassName="fill-foreground"
          cClassName="fill-background"
          playClassName="fill-(--brown)"
        />
        <path d={wordmarkPath} className="fill-foreground" />
      </svg>
      <span className="sr-only">{name}</span>
    </span>
  );
}
