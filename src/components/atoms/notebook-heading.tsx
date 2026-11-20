import type { ReactNode } from "react";
import { cn } from "@/lib/style/cn";

type NotebookHeadingProps = {
  children: ReactNode;
  className?: string;
};

export function NotebookHeading({ children, className }: NotebookHeadingProps) {
  return (
    <h2
      className={cn(
        "flex items-center gap-2 font-bold font-display text-[15px] leading-7 lg:gap-2.5 lg:text-[17px]",
        className,
      )}
    >
      <span aria-hidden className="h-0.5 w-3 shrink-0 bg-primary lg:w-4" />
      {children}
    </h2>
  );
}
