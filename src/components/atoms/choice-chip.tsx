import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/style/cn";

export const choiceChipVariants = cva(
  "inline-flex cursor-pointer select-none items-center justify-center gap-1.5 border shadow-[0_2px_0_0_var(--chip-edge)] transition-all active:translate-y-[2px] active:shadow-none has-checked:translate-y-[2px] has-checked:shadow-[inset_0_2px_3px_0_rgb(0_0_0/0.2)] data-[active=true]:translate-y-[2px] data-[active=true]:shadow-[inset_0_2px_3px_0_rgb(0_0_0/0.2)] has-checked:border-[1.5px] has-checked:border-selected-border has-checked:bg-selected has-checked:text-selected-foreground has-disabled:cursor-not-allowed has-disabled:opacity-50 has-focus-visible:ring-2 has-focus-visible:ring-ring/60 data-[active=true]:border-[1.5px] data-[active=true]:border-selected-border data-[active=true]:bg-selected data-[active=true]:text-selected-foreground",
  {
    variants: {
      shape: {
        pill: "rounded-full",
        square: "rounded-md",
        block: "flex-1 rounded-lg font-bold tabular-nums",
      },
      size: {
        sm: "h-8 px-2.5 text-xs",
        md: "h-9.5 px-3.5 font-medium text-[13px]",
        lg: "h-11 px-3 text-base",
      },
      tone: {
        plain:
          "[--chip-edge:var(--color-input)] border-input bg-card text-foreground hover:bg-secondary",
        field:
          "[--chip-edge:var(--color-input)] border-input bg-field text-foreground-sub hover:bg-secondary",
        genre:
          "[--chip-edge:var(--color-genre)] border-genre bg-transparent text-genre-foreground hover:bg-secondary",
      },
    },
    defaultVariants: { shape: "pill", size: "md", tone: "plain" },
  },
);

type ChoiceChipProps = Omit<ComponentProps<"input">, "className" | "size"> &
  VariantProps<typeof choiceChipVariants> & { className?: string };

export function ChoiceChip({
  shape,
  size,
  tone,
  className,
  children,
  ...props
}: ChoiceChipProps) {
  return (
    <label className={cn(choiceChipVariants({ shape, size, tone }), className)}>
      <input className="sr-only" {...props} />
      {children}
    </label>
  );
}
