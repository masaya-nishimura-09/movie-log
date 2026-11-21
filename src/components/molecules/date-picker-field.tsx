"use client";

import { useState } from "react";
import { ja } from "react-day-picker/locale";
import { Calendar } from "@/components/molecules/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/molecules/popover";
import type { Locale } from "@/i18n/locales";
import { toDateInputValue } from "@/lib/date/format-date";

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
  const sameYear = selected?.getFullYear() === new Date().getFullYear();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <input type="hidden" name={name} value={value} />
      <PopoverTrigger
        id={id}
        data-field={name}
        className="h-7 rounded-sm px-0.5 text-[13px] text-paper-ink tabular-nums underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring lg:text-[15px]"
      >
        {selected &&
          new Intl.DateTimeFormat(lang, {
            year: sameYear ? undefined : "numeric",
            month: sameYear ? "numeric" : "2-digit",
            day: sameYear ? "numeric" : "2-digit",
            weekday: "short",
          }).format(selected)}
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
