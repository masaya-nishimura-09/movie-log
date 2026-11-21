export const timeZoneCookie = "tz";

export function validTimeZone(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    return new Intl.DateTimeFormat("en", { timeZone: value }).resolvedOptions()
      .timeZone;
  } catch {
    return undefined;
  }
}
