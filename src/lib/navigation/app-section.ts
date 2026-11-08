import type { Locale } from "@/i18n/locales";

export type AppSection = "records" | "newRecord";

export function appSectionOf(
  pathname: string,
  lang: Locale,
): AppSection | undefined {
  if (pathname === `/${lang}/records/new`) return "newRecord";
  if (pathname.startsWith(`/${lang}/records`)) return "records";
  return undefined;
}
