import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";
import { cn } from "@/lib/style/cn";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-7 w-full min-w-0 border-0 border-outline border-b-[1.5px] bg-transparent px-0.5 text-base text-foreground outline-none transition-colors placeholder:text-placeholder focus-visible:border-primary disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-[15px]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
