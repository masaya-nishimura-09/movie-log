import type { Locale } from "@/i18n/locales";

export type AppSection = "home" | "records" | "articles" | "newRecord";

export function appSectionOf(
  pathname: string,
  lang: Locale,
): AppSection | undefined {
  if (pathname === `/${lang}/home`) return "home";
  if (pathname === `/${lang}/records/new`) return "newRecord";
  if (
    pathname.startsWith(`/${lang}/articles`) ||
    (pathname.startsWith(`/${lang}/records/`) &&
      pathname.split("/")[4] === "articles")
  ) {
    return "articles";
  }
  if (pathname.startsWith(`/${lang}/records`)) return "records";
  return undefined;
}
