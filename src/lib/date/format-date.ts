import type { Locale } from "@/i18n/locales";

const styles = {
  short: { month: "numeric", day: "numeric" },
  medium: { year: "numeric", month: "2-digit", day: "2-digit" },
  long: { year: "numeric", month: "long", day: "numeric", weekday: "short" },
  longDate: { year: "numeric", month: "long", day: "numeric" },
  weekday: { weekday: "short" },
  dateTime: {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  },
  month: { year: "numeric", month: "long" },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

export type DateStyle = keyof typeof styles;

export function formatDate(
  iso: string,
  locale: Locale,
  style: DateStyle,
): string {
  return new Intl.DateTimeFormat(locale, styles[style]).format(new Date(iso));
}

export function toDateInputValue(date: Date): string {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}
