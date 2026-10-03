import { z } from "zod";
import {
  creditRoleSchema,
  genreSchema,
  moodTagSchema,
  platformSchema,
  scoreSchema,
} from "@/schemas/record/enums";

export const recordInputSchema = z.object({
  title: z.string().min(1).max(255),
  watchedAt: z.iso.datetime().refine((at) => Date.parse(at) <= Date.now()),
  score: z.coerce.number().pipe(scoreSchema),
  platform: platformSchema,
  releaseYear: z.coerce
    .number()
    .int()
    .min(1888)
    .refine((year) => year <= new Date().getFullYear() + 5),
  runtime: z.coerce.number().int().min(0).max(1440),
  genres: z.array(genreSchema),
  countries: z.array(z.string().regex(/^[A-Z]{2}$/)),
  language: z.string().min(1),
  credits: z.array(
    z.object({
      personName: z.string().min(1).max(100),
      creditRole: creditRoleSchema,
    }),
  ),
  posterUrl: z.union([z.literal(""), z.url({ protocol: /^https?$/ })]),
  moodTags: z.array(moodTagSchema),
  memo: z.string().max(1000),
});

export type RecordInput = z.infer<typeof recordInputSchema>;

export type RecordInputField = keyof RecordInput;

export function toRecordRequest(input: RecordInput) {
  return {
    title: input.title,
    release_year: input.releaseYear,
    runtime: input.runtime,
    genres: input.genres,
    countries: input.countries,
    language: input.language,
    credits: input.credits.map((credit) => ({
      person_name: credit.personName,
      credit_role: credit.creditRole,
    })),
    poster_url: input.posterUrl,
    watched_at: input.watchedAt,
    platform: input.platform,
    score: input.score,
    mood_tags: input.moodTags,
    memo: input.memo,
  };
}
