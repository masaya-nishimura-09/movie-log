import {
  cPath,
  playPath,
  stampPath,
  wordmarkPath,
} from "@/components/atoms/logo-paths";
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
        <path d={stampPath} className="fill-foreground" />
        <path d={cPath} className="fill-background" />
        <circle cx="71.385" cy="39.573" r="4.5" className="fill-background" />
        <circle cx="71.385" cy="70.427" r="4.5" className="fill-background" />
        <path d={playPath} fill="var(--brown)" />
        <path d={wordmarkPath} className="fill-foreground" />
      </svg>
      <span className="sr-only">{name}</span>
    </span>
  );
}
