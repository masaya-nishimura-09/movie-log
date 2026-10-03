import { Clapperboard } from "lucide-react";
import { cn } from "@/lib/style/cn";

export function Logo({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-bold text-[19px] text-foreground leading-none",
        className,
      )}
    >
      <Clapperboard className="size-5.5 text-primary" aria-hidden />
      {name}
    </span>
  );
}
