export const timeZoneCookie = "tz";

export const defaultTimeZone = "Asia/Tokyo";

export function resolveTimeZone(value: string | undefined): string {
  if (value === undefined || value === "") return defaultTimeZone;
  try {
    return new Intl.DateTimeFormat("en", { timeZone: value }).resolvedOptions()
      .timeZone;
  } catch {
    return defaultTimeZone;
  }
}
