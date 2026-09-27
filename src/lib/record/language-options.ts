import type { Locale } from "@/i18n/locales";
import type { SelectOption } from "@/schemas/record/record-form";

const unknownLanguage = "und";

const languageCodes = [
  "ja",
  "en",
  "fr",
  "de",
  "it",
  "es",
  "pt",
  "ru",
  "ko",
  "zh",
  "hi",
  "th",
  "fa",
  "sv",
  "da",
  unknownLanguage,
];

export function languageName(
  locale: Locale,
  code: string,
  unknownLabel: string,
): string {
  if (code === unknownLanguage) return unknownLabel;
  return new Intl.DisplayNames(locale, { type: "language" }).of(code) ?? code;
}

export function buildLanguageOptions(
  locale: Locale,
  current: string,
  unknownLabel: string,
): SelectOption[] {
  const codes = languageCodes.includes(current)
    ? languageCodes
    : [current, ...languageCodes];
  return codes.map((code) => ({
    value: code,
    label: `${languageName(locale, code, unknownLabel)} ${code}`,
  }));
}
