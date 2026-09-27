import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import type ja from "@/i18n/dictionaries/ja.json";
import { hasLocale, type Locale } from "@/i18n/locales";

export type Dictionary = typeof ja;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ja: () => import("@/i18n/dictionaries/ja.json").then((m) => m.default),
  en: () => import("@/i18n/dictionaries/en.json").then((m) => m.default),
};

export async function getLocale(): Promise<Locale> {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return locale;
}

export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()]();
}
