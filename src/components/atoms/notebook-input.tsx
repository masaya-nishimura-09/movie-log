import type { ComponentProps } from "react";
import { cn } from "@/lib/style/cn";

export const notebookLine =
  "border-[rgb(10_41_71/0.18)] border-b aria-invalid:border-destructive";

export const notebookPlaceholder = "placeholder:text-[#a8a397]";

export function NotebookInput({
  className,
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-7 w-full min-w-0 bg-transparent px-0.5 text-[13px] text-paper-ink outline-none focus:border-primary lg:text-sm",
        notebookLine,
        notebookPlaceholder,
        className,
      )}
      {...props}
    />
  );
}
