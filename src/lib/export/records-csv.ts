import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { languageName } from "@/lib/record/language-options";
import type { MovieRecord } from "@/schemas/record/record";

function csvField(value: string | number): string {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function localDate(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function toRecordsCsv(
  records: MovieRecord[],
  lang: Locale,
  dict: Pick<Dictionary, "recordForm" | "enums">,
): string {
  const f = dict.recordForm;
  const regionNames = new Intl.DisplayNames(lang, { type: "region" });
  const list = (values: string[]) => values.join(" / ");
  const header = [
    f.title,
    f.originalTitle,
    f.watchedAt,
    f.platform,
    f.score,
    f.moodTags,
    f.releaseYear,
    f.runtime,
    f.genres,
    f.countries,
    f.language,
    f.credits,
    f.overview,
    f.memo,
    f.posterUrl,
  ];
  const rows = records.map((record) => [
    record.title,
    record.originalTitle,
    localDate(record.watchedAt),
    dict.enums.platform[record.platform],
    record.score,
    list(record.moodTags.map((mood) => dict.enums.moodTag[mood])),
    record.releaseYear > 0 ? record.releaseYear : "",
    record.runtime > 0 ? record.runtime : "",
    list(record.genres.map((genre) => dict.enums.genre[genre])),
    list(record.countries.map((code) => regionNames.of(code) ?? code)),
    languageName(lang, record.language, f.languageUnknown),
    list(
      record.credits.map(
        (credit) =>
          `${dict.enums.creditRole[credit.creditRole]}: ${credit.personName}`,
      ),
    ),
    record.overview,
    record.memo,
    record.posterUrl,
  ]);
  return `﻿${[header, ...rows]
    .map((row) => row.map(csvField).join(","))
    .join("\r\n")}\r\n`;
}
