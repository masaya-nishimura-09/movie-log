import type * as React from "react";
import { cn } from "@/lib/style/cn";
import { ruledLines } from "@/lib/style/paper";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        ruledLines,
        "field-sizing-content flex min-h-28 w-full resize-none bg-[linear-gradient(to_bottom,transparent_27px,var(--paper-line)_27px,var(--paper-line)_28px)] bg-size-[100%_28px] bg-local px-0.5 text-base text-foreground leading-7 outline-none placeholder:text-placeholder focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-1 aria-invalid:ring-destructive md:text-[15px]",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
