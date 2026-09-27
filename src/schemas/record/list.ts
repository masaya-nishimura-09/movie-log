import { z } from "zod";
import {
  genreSchema,
  moodTagSchema,
  platformSchema,
  scoreSchema,
} from "@/schemas/record/enums";
import { recordSchema } from "@/schemas/record/record";

export const recordSortSchema = z.enum([
  "watchedAtDesc",
  "watchedAtAsc",
  "scoreDesc",
  "releaseYearDesc",
  "titleAsc",
]);

export type RecordSort = z.infer<typeof recordSortSchema>;

export const recordSorts = recordSortSchema.options;

export const recordQuerySchema = z.object({
  scores: z.array(scoreSchema),
  platforms: z.array(platformSchema),
  moodTags: z.array(moodTagSchema),
  genres: z.array(genreSchema),
  keyword: z.string(),
  sort: recordSortSchema,
  page: z.number().int().min(1),
});

export type RecordQuery = z.infer<typeof recordQuerySchema>;

const countSchema = z.number().int().min(0);

export const recordListSchema = z.object({
  records: z.array(recordSchema),
  totalCount: countSchema,
  filteredCount: countSchema,
  page: z.number().int().min(1),
  pageCount: z.number().int().min(1),
  facets: z.object({
    scores: z.record(z.string(), countSchema),
    platforms: z.record(z.string(), countSchema),
    moodTags: z.record(z.string(), countSchema),
    genres: z.record(z.string(), countSchema),
  }),
});

export type RecordList = z.infer<typeof recordListSchema>;
