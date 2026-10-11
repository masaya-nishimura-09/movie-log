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
  count?: number;
  selectedLabel?: string;
  wide?: boolean;
  children: ReactNode;
};

export function FilterButton({
  label,
  count = 0,
  selectedLabel,
  wide,
  children,
}: FilterButtonProps) {
  const active = count > 0 || selectedLabel !== undefined;

  return (
    <Popover>
      <PopoverTrigger
        aria-label={selectedLabel && `${label}: ${selectedLabel}`}
        className={cn(
          "flex h-9.5 items-center gap-1.5 rounded-full px-3.5 font-medium text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active
            ? "bg-selected text-selected-foreground"
            : "bg-control text-foreground-sub hover:text-foreground",
        )}
      >
        {selectedLabel ?? label}
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
