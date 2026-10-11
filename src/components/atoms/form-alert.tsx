import type { ComponentProps } from "react";
import { cn } from "@/lib/style/cn";

export function FormAlert({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      role="alert"
      className={cn(
        "rounded-lg bg-destructive/10 px-3.5 py-2.5 text-destructive-foreground text-sm",
        className,
      )}
      {...props}
    />
  );
}
