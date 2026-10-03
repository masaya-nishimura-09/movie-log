"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/molecules/popover";
import { cn } from "@/lib/style/cn";

type FilterButtonProps = {
  label: string;
  count: number;
  wide?: boolean;
  children: ReactNode;
};

export function FilterButton({
  label,
  count,
  wide,
  children,
}: FilterButtonProps) {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "flex h-9.5 items-center gap-1.5 rounded-full border px-3.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring",
          count > 0
            ? "border-selected-border bg-selected font-bold text-selected-foreground"
            : "border-input bg-card text-foreground-sub hover:text-foreground",
        )}
      >
        {label}
        {count > 0 && <span className="tabular-nums">{count}</span>}
        <ChevronDown className="size-3.5" aria-hidden />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn("max-h-96 overflow-y-auto p-3.5", wide ? "w-96" : "w-80")}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
