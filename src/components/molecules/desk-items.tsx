import type { ReactNode } from "react";
import { cn } from "@/lib/style/cn";

export function LetterPaper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "paper-theme relative rounded-md bg-paper px-5.5 pt-6 pb-5 text-paper-ink shadow-[0_18px_36px_rgb(10_41_71/0.25)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
