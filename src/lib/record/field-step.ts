import type { RecordFieldErrors } from "@/lib/record/field-error";

export const recordSteps = ["basics", "movie", "impression"] as const;

export type RecordStep = (typeof recordSteps)[number];

export function isRecordStep(value: unknown): value is RecordStep {
  return recordSteps.some((step) => step === value);
}

export const recordFieldSteps: Record<string, number> = {
  title: 0,
  watchedAt: 0,
  score: 0,
  platform: 0,
  originalTitle: 1,
  overview: 1,
  releaseYear: 1,
  runtime: 1,
  language: 1,
  countries: 1,
  genres: 1,
  credits: 1,
  posterUrl: 1,
  moodTags: 2,
  note: 2,
};

export function errorSteps(errors: RecordFieldErrors | undefined): number[] {
  const steps = Object.keys(errors ?? {}).map(
    (field) => recordFieldSteps[field] ?? 0,
  );
  return [...new Set(steps)].sort((a, b) => a - b);
}
