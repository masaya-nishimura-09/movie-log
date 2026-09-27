import { toDateInputValue } from "@/lib/date/format-date";
import type { MovieRecord } from "@/schemas/record/record";
import type { RecordFormValues } from "@/schemas/record/record-form";

export function emptyFormValues(today: Date): RecordFormValues {
  return {
    title: "",
    watchedAt: toDateInputValue(today),
    runtime: 0,
    genres: [],
    countries: [],
    language: "ja",
    credits: [],
    posterUrl: "",
    moodTags: [],
    memo: "",
  };
}

export function toFormValues(record: MovieRecord): RecordFormValues {
  return {
    title: record.title,
    watchedAt: toDateInputValue(new Date(record.watchedAt)),
    releaseYear: record.releaseYear,
    runtime: record.runtime,
    genres: record.genres,
    countries: record.countries,
    language: record.language,
    credits: record.credits,
    posterUrl: record.posterUrl,
    platform: record.platform,
    score: record.score,
    moodTags: record.moodTags,
    memo: record.memo,
  };
}

export function maxReleaseYear(today: Date): number {
  return today.getFullYear() + 5;
}
