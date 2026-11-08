import { z } from "zod";
import {
  creditRoleSchema,
  genreSchema,
  moodTagSchema,
  platformSchema,
  scoreSchema,
} from "@/schemas/record/enums";
import { type Note, noteResponseSchema } from "@/schemas/record/note";

const creditSchema = z.object({
  personName: z.string(),
  creditRole: creditRoleSchema,
});

export type Credit = z.infer<typeof creditSchema>;

export const recordSchema = z.object({
  recordId: z.string(),
  title: z.string(),
  originalTitle: z.string(),
  overview: z.string(),
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
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type MovieRecord = z.infer<typeof recordSchema>;

const recordResponseFields = {
  record_id: z.string(),
  title: z.string(),
  original_title: z.string().default(""),
  overview: z.string().default(""),
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
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
};

const recordResponseObject = z.object(recordResponseFields);

function toRecord(r: z.output<typeof recordResponseObject>): MovieRecord {
  return {
    recordId: r.record_id,
    title: r.title,
    originalTitle: r.original_title,
    overview: r.overview,
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
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export const recordResponseSchema = recordResponseObject.transform(toRecord);

export type RecordResponse = z.input<typeof recordResponseSchema>;

export type RecordDetail = MovieRecord & { note: Note | null };

export const recordDetailResponseSchema = recordResponseObject
  .extend({ note: noteResponseSchema.nullable().default(null) })
  .transform((r): RecordDetail => ({ ...toRecord(r), note: r.note }));

export type RecordDetailResponse = z.input<typeof recordDetailResponseSchema>;
