import type { Locale } from "@/i18n/locales";
import { pathOf, safeFromHref } from "@/lib/url/back-href";

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
    `/${lang}/home`,
  ]);
}

export function isFromArticleList(from: string, lang: Locale): boolean {
  return pathOf(from) === articleListPath(lang);
}
