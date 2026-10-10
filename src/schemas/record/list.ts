import { z } from "zod";
import {
  genreSchema,
  moodTagSchema,
  platformSchema,
  scoreSchema,
} from "@/schemas/record/enums";
import { recordResponseSchema, recordSchema } from "@/schemas/record/record";

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
  score: scoreSchema.optional(),
  platform: platformSchema.optional(),
  moodTags: z.array(moodTagSchema),
  genres: z.array(genreSchema),
  keyword: z.string(),
  sort: recordSortSchema,
  page: z.number().int().min(1),
});

export type RecordQuery = z.infer<typeof recordQuerySchema>;

const countSchema = z.number().int().min(0);

export const recordListResponseSchema = z
  .object({
    records: z.array(recordResponseSchema),
    filtered_count: countSchema,
    total_count: countSchema,
  })
  .transform((r) => ({
    records: r.records,
    filteredCount: r.filtered_count,
    totalCount: r.total_count,
  }));

export const recordListSchema = z.object({
  records: z.array(recordSchema),
  totalCount: countSchema,
  filteredCount: countSchema,
  page: z.number().int().min(1),
  pageCount: z.number().int().min(1),
});

export type RecordList = z.infer<typeof recordListSchema>;
