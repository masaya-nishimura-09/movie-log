import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { languageName } from "@/lib/record/language-options";
import { interpolate } from "@/lib/text/interpolate";
import type { MovieRecord } from "@/schemas/record/record";

export type MovieInfoRow = { key: string; label: string; value: string };

export function movieInfoRows(
  lang: Locale,
  record: MovieRecord,
  dict: Dictionary,
): MovieInfoRow[] {
  const d = dict.recordDetail;
  const list = new Intl.ListFormat(lang);
  const regionNames = new Intl.DisplayNames(lang, { type: "region" });
  const join = (values: string[]) => values.filter(Boolean).join(" · ");
  const names = (role: "director" | "cast") =>
    list.format(
      record.credits
        .filter((credit) => credit.creditRole === role)
        .map((credit) => credit.personName),
    );
  return [
    {
      key: "released",
      label: d.released,
      value: join([
        record.releaseYear > 0
          ? interpolate(d.releaseYear, { year: record.releaseYear })
          : "",
        record.runtime > 0
          ? interpolate(d.runtime, { minutes: record.runtime })
          : "",
      ]),
    },
    {
      key: "production",
      label: d.production,
      value: join([
        list.format(
          record.countries.map((code) => regionNames.of(code) ?? code),
        ),
        record.language === "" ? "" : languageName(lang, record.language, ""),
      ]),
    },
    {
      key: "genres",
      label: d.genres,
      value: list.format(record.genres.map((genre) => dict.enums.genre[genre])),
    },
    { key: "directors", label: d.directors, value: names("director") },
    { key: "cast", label: d.cast, value: names("cast") },
  ].filter((row) => row.value !== "");
}
