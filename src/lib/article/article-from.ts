import type { Locale } from "@/i18n/locales";
import { safeFromHref } from "@/lib/url/back-href";

function articleListPath(lang: Locale): string {
  return `/${lang}/articles`;
}

export function articleFrom(
  value: string | string[] | undefined,
  lang: Locale,
  recordId: string,
): string | undefined {
  return safeFromHref(value, [
    articleListPath(lang),
    `/${lang}/records/${recordId}`,
  ]);
}

export function isFromArticleList(from: string, lang: Locale): boolean {
  return from.split("?")[0] === articleListPath(lang);
}
