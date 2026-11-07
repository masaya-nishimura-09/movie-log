import { cn } from "@/lib/style/cn";

export function MaskingTape({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute -top-2 left-1/2 h-4.5 w-16 -translate-x-1/2 -rotate-3 bg-[color-mix(in_oklab,var(--sage)_72%,transparent)] shadow-[0_1px_1px_rgb(0_0_0/0.08)] [clip-path:polygon(0_8%,4%_0,8%_10%,12%_0,88%_0,92%_10%,96%_0,100%_8%,100%_92%,96%_100%,92%_90%,88%_100%,12%_100%,8%_90%,4%_100%,0_92%)]",
        className,
      )}
    />
  );
}
