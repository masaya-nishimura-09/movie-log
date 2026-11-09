"use client";

import { Info } from "lucide-react";
import { phrases } from "@/components/atoms/phrases";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/molecules/popover";

type InfoTipProps = {
  label: string;
  children: string;
};

export function InfoTip({ label, children }: InfoTipProps) {
  return (
    <Popover>
      <PopoverTrigger
        aria-label={label}
        className="inline-grid size-5 shrink-0 place-items-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-popup-open:text-foreground"
      >
        <Info className="size-3.5" aria-hidden />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-64 px-3.5 py-3 text-[13px] text-foreground leading-relaxed"
      >
        {phrases(children)}
      </PopoverContent>
    </Popover>
  );
}
