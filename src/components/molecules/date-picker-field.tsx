"use client";

import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { ja } from "react-day-picker/locale";
import { Calendar } from "@/components/molecules/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/molecules/popover";
import type { Locale } from "@/i18n/locales";
import { dateStyles, toDateInputValue } from "@/lib/date/format-date";

type DatePickerFieldProps = {
  id: string;
  name: string;
  value: string;
  onValueChange: (value: string) => void;
  lang: Locale;
};

export function DatePickerField({
  id,
  name,
  value,
  onValueChange,
  lang,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = value === "" ? undefined : new Date(`${value}T00:00`);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <input type="hidden" name={name} value={value} />
      <PopoverTrigger
        id={id}
        className="flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-field px-3.5 font-medium text-[15px] text-foreground tabular-nums outline-none focus-visible:ring-1 focus-visible:ring-selected-border"
      >
        {selected &&
          new Intl.DateTimeFormat(lang, dateStyles.longDate).format(selected)}
        <CalendarDays className="size-4 text-muted-foreground" aria-hidden />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-1">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            if (!date) return;
            onValueChange(toDateInputValue(date));
            setOpen(false);
          }}
          disabled={{ after: new Date() }}
          locale={lang === "ja" ? ja : undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
