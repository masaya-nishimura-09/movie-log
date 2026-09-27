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
        "font-bold font-heading text-[19px] text-foreground leading-none",
        className,
      )}
    >
      {name}
    </span>
  );
}
