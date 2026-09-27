import type * as React from "react";
import { cn } from "@/lib/style/cn";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content flex min-h-16 w-full rounded-lg border border-input bg-field px-3.5 py-3 text-[15px] text-foreground leading-loose outline-none transition-colors placeholder:text-placeholder focus-visible:border-selected-border focus-visible:bg-card focus-visible:ring-1 focus-visible:ring-selected-border disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
