"use client";

import { ChevronDown, X } from "lucide-react";
import { type ReactNode, useRef, useState } from "react";
import { notebookLine } from "@/components/atoms/notebook-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/molecules/popover";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/molecules/sheet";
import { useWideScreen } from "@/hooks/use-wide-screen";
import { cn } from "@/lib/style/cn";

type Option = { value: string; label: string };

type ChoicePickerProps = {
  id?: string;
  name: string;
  title: string;
  placeholder: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
  invalid?: boolean;
  closeLabel: string;
};

export const pickerChip =
  "inline-flex h-5.5 shrink-0 items-center rounded-full bg-(--sage) px-2 text-(--navy) text-[11px] leading-5.5 lg:h-6 lg:px-2.5 lg:text-xs";

export function ChoicePicker({
  id,
  name,
  title,
  placeholder,
  options,
  value,
  onChange,
  multiple = false,
  invalid = false,
  closeLabel,
}: ChoicePickerProps) {
  const [open, setOpen] = useState(false);
  const latest = useRef(value);
  latest.current = value;
  const wide = useWideScreen();
  const selected = options.filter((option) => value.includes(option.value));

  const toggle = (option: string) => {
    const current = latest.current;
    const next = multiple
      ? current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option]
      : current.includes(option)
        ? []
        : [option];
    latest.current = next;
    onChange(next);
    if (multiple) return;
    setOpen(false);
  };

  const triggerClass = cn(
    "flex h-7 w-full min-w-0 items-center justify-between gap-1.5 px-0.5 text-left text-[13px] outline-none focus-visible:border-primary lg:text-sm",
    notebookLine,
  );
  const triggerContent: ReactNode = (
    <>
      {selected.length === 0 ? (
        <span className="truncate text-[#a8a397]">{placeholder}</span>
      ) : multiple ? (
        <span className="flex min-w-0 gap-1 overflow-hidden lg:gap-1.5">
          {selected.map((option) => (
            <span key={option.value} className={pickerChip}>
              {option.label}
            </span>
          ))}
        </span>
      ) : (
        <span className="truncate">{selected[0]?.label}</span>
      )}
      <ChevronDown className="size-3.5 shrink-0" aria-hidden />
    </>
  );
  const header = (
    <div className="mb-3 flex items-center justify-between">
      <span className="font-bold text-[15px]">{title}</span>
    </div>
  );
  const choices = (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const checked = value.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={checked}
            onClick={() => toggle(option.value)}
            className={cn(
              "h-8 whitespace-nowrap rounded-full px-3 text-(--navy) text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring",
              checked
                ? "bg-(--sage) shadow-[inset_0_0_0_1.5px_var(--brown)]"
                : "bg-[rgb(10_41_71/0.05)] hover:bg-[rgb(10_41_71/0.09)]",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
  const hiddenInputs = value.map((v) => (
    <input key={v} type="hidden" name={name} value={v} />
  ));
  const triggerProps = {
    id,
    "data-field": name,
    "aria-invalid": invalid || undefined,
    className: triggerClass,
  };

  if (wide === false) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        {hiddenInputs}
        <SheetTrigger {...triggerProps}>{triggerContent}</SheetTrigger>
        <SheetContent
          side="bottom"
          closeLabel={closeLabel}
          className="max-h-[80dvh] gap-0 rounded-t-[20px] bg-[#fffdf8] p-4.5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-(--navy)"
        >
          <SheetTitle className="mb-3 font-bold text-[15px]">
            {title}
          </SheetTitle>
          <div className="overflow-y-auto">{choices}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {hiddenInputs}
      <PopoverTrigger {...triggerProps}>{triggerContent}</PopoverTrigger>
      <PopoverContent
        align="start"
        className="relative w-[min(36rem,calc(100vw-2rem))] gap-0 rounded-[14px] bg-[#fffdf8] p-4.5 pt-4.5 pb-3.5 text-(--navy) shadow-[0_18px_40px_rgb(10_41_71/0.22),0_0_0_1px_rgb(10_41_71/0.06)] ring-0"
      >
        {header}
        <button
          type="button"
          aria-label={closeLabel}
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 grid size-8 place-items-center rounded-lg outline-none hover:bg-[rgb(10_41_71/0.06)] focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" aria-hidden />
        </button>
        {choices}
      </PopoverContent>
    </Popover>
  );
}
