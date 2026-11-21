import { cn } from "@/lib/style/cn";

export function MaskingTape({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute -top-2.5 left-1/2 h-5.5 w-16 -translate-x-1/2 bg-[rgb(211_212_192/0.8)] shadow-[0_1px_2px_rgb(10_41_71/0.12)]",
        className,
      )}
    />
  );
}
