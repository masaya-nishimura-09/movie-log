import type { Metadata } from "next";
import { type Locale, locales } from "@/i18n/locales";
import { siteUrl } from "@/lib/env";

export function languageUrls(path: string) {
  return {
    ...Object.fromEntries(
      locales.map((locale) => [locale, `${siteUrl}/${locale}${path}`]),
    ),
    "x-default": `${siteUrl}${path}`,
  } as Record<Locale | "x-default", string>;
}

export function alternates(lang: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: `${siteUrl}/${lang}${path}`,
    languages: languageUrls(path),
  };
}
