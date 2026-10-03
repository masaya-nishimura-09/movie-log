import { Temporal } from "@js-temporal/polyfill";

export function startOfLocalDay(date: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  return Temporal.PlainDate.from(date)
    .toZonedDateTime({ timeZone: Temporal.Now.timeZoneId() })
    .toInstant()
    .toString();
}
