"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/molecules/popover";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";

type FilterButtonProps = {
  label: string;
  count?: number;
  selectedLabel?: string;
  selectedTemplate: string;
  wide?: boolean;
  children: ReactNode;
};

export function FilterButton({
  label,
  count = 0,
  selectedLabel,
  selectedTemplate,
  wide,
  children,
}: FilterButtonProps) {
  const active = count > 0 || selectedLabel !== undefined;

  return (
    <Popover>
      <PopoverTrigger
        aria-label={selectedLabel && `${label}: ${selectedLabel}`}
        className={cn(
          "flex h-9 items-center gap-1 rounded-full pr-2.5 pl-3 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active
            ? "bg-foreground text-background"
            : "bg-secondary text-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
        )}
      >
        {selectedLabel === undefined
          ? label
          : interpolate(selectedTemplate, { label, value: selectedLabel })}
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
