"use client";

import { useId } from "react";
import { InlineScript } from "@/components/atoms/inline-script";
import type { Locale } from "@/i18n/locales";
import { type DateStyle, dateStyles, formatDate } from "@/lib/date/format-date";

type LocalDateProps = {
  date: string;
  locale: Locale;
  dateStyle: DateStyle;
};

export function LocalDate({ date, locale, dateStyle }: LocalDateProps) {
  const id = useId();
  const options = JSON.stringify(dateStyles[dateStyle]);

  return (
    <>
      <time id={id} dateTime={date} suppressHydrationWarning>
        {formatDate(date, locale, dateStyle)}
      </time>
      <InlineScript
        html={`{var n=document.getElementById(${JSON.stringify(id)});if(n)n.textContent=new Intl.DateTimeFormat(${JSON.stringify(locale)},${options}).format(new Date(${JSON.stringify(date)}))}`}
      />
    </>
  );
}
