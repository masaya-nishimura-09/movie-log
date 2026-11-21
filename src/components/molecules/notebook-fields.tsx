import type { ReactNode } from "react";
import { cn } from "@/lib/style/cn";

type NotebookFieldsProps = {
  rows: { key: string; label: string; value: ReactNode }[];
  size: "md" | "lg";
  className?: string;
};

export function NotebookFields({ rows, size, className }: NotebookFieldsProps) {
  return (
    <dl className={className}>
      {rows.map((row) => (
        <div
          key={row.key}
          className={cn(
            "flex items-start",
            size === "md" ? "gap-2 lg:gap-3" : "gap-2 lg:gap-3.5",
          )}
        >
          <dt
            className={cn(
              "shrink-0 font-semibold text-paper-label text-xs leading-7",
              size === "md"
                ? "w-14 lg:w-16 lg:text-xs"
                : "w-16 lg:w-18 lg:text-[13px]",
            )}
          >
            {row.label}
          </dt>
          <dd className="min-w-0 break-words">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
