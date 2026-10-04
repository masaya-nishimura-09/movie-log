import type { Locale } from "@/i18n/locales";

export const dateStyles = {
  short: { month: "numeric", day: "numeric" },
  medium: { year: "numeric", month: "2-digit", day: "2-digit" },
  longDate: { year: "numeric", month: "long", day: "numeric" },
  dateTime: {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

export type DateStyle = keyof typeof dateStyles;

export function formatDate(
  iso: string,
  locale: Locale,
  style: DateStyle,
): string {
  return new Intl.DateTimeFormat(locale, dateStyles[style]).format(
    new Date(iso),
  );
}

export function toDateInputValue(date: Date): string {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}
