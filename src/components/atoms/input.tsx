import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";
import { cn } from "@/lib/style/cn";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-lg bg-field px-3.5 text-[15px] text-foreground outline-none transition-colors file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-placeholder focus-visible:border-selected-border focus-visible:bg-card focus-visible:ring-1 focus-visible:ring-selected-border disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:bg-destructive/5 aria-invalid:ring-1 aria-invalid:ring-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
