import { z } from "zod";
import {
  creditRoleSchema,
  genreSchema,
  moodTagSchema,
  platformSchema,
  scoreSchema,
} from "@/schemas/record/enums";

export const creditSchema = z.object({
  personName: z.string(),
  creditRole: creditRoleSchema,
});

export type Credit = z.infer<typeof creditSchema>;

export const recordSchema = z.object({
  recordId: z.string(),
  title: z.string(),
  releaseYear: z.number().int(),
  runtime: z.number().int(),
  genres: z.array(genreSchema),
  countries: z.array(z.string()),
  language: z.string(),
  credits: z.array(creditSchema),
  posterUrl: z.string(),
  watchedAt: z.iso.datetime(),
  platform: platformSchema,
  score: scoreSchema,
  moodTags: z.array(moodTagSchema),
  memo: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type MovieRecord = z.infer<typeof recordSchema>;

export const recordResponseSchema = z
  .object({
    record_id: z.string(),
    title: z.string(),
    release_year: z.number().int(),
    runtime: z.number().int(),
    genres: z.array(genreSchema),
    countries: z.array(z.string()),
    language: z.string(),
    credits: z.array(
      z.object({
        person_name: z.string(),
        credit_role: creditRoleSchema,
      }),
    ),
    poster_url: z.string(),
    watched_at: z.iso.datetime(),
    platform: platformSchema,
    score: scoreSchema,
    mood_tags: z.array(moodTagSchema),
    memo: z.string(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
  })
  .transform(
    (r): MovieRecord => ({
      recordId: r.record_id,
      title: r.title,
      releaseYear: r.release_year,
      runtime: r.runtime,
      genres: r.genres,
      countries: r.countries,
      language: r.language,
      credits: r.credits.map((c) => ({
        personName: c.person_name,
        creditRole: c.credit_role,
      })),
      posterUrl: r.poster_url,
      watchedAt: r.watched_at,
      platform: r.platform,
      score: r.score,
      moodTags: r.mood_tags,
      memo: r.memo,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }),
  );

export type RecordResponse = z.input<typeof recordResponseSchema>;
