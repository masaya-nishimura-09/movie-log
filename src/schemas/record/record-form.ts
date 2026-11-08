import { z } from "zod";
import { noteContentSchema } from "@/schemas/record/note";
import { recordSchema } from "@/schemas/record/record";

export const recordFormValuesSchema = recordSchema
  .pick({
    title: true,
    originalTitle: true,
    overview: true,
    releaseYear: true,
    runtime: true,
    genres: true,
    countries: true,
    language: true,
    credits: true,
    posterUrl: true,
    platform: true,
    score: true,
    moodTags: true,
  })
  .extend({ watchedAt: z.string(), note: noteContentSchema.optional() })
  .partial({ releaseYear: true, platform: true, score: true });

export type RecordFormValues = z.infer<typeof recordFormValuesSchema>;
