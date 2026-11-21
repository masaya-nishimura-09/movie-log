import type { RecordFieldErrors } from "@/lib/record/field-error";

export const recordPageCount = 4;

export const recordFieldPages: Record<string, number> = {
  title: 0,
  watchedAt: 0,
  score: 0,
  platform: 0,
  moodTags: 0,
  posterUrl: 0,
  originalTitle: 1,
  overview: 1,
  releaseYear: 1,
  runtime: 1,
  language: 1,
  countries: 1,
  genres: 1,
  credits: 1,
  note: 2,
};

export function fieldPage(field: string): number {
  return recordFieldPages[field] ?? 0;
}

export function errorPages(errors: RecordFieldErrors | undefined): number[] {
  const pages = Object.keys(errors ?? {}).map(fieldPage);
  return [...new Set(pages)].sort((a, b) => a - b);
}

export function spreadOf(page: number): number {
  return Math.floor(page / 2);
}
