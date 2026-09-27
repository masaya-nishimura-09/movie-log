import { z } from "zod";
import { recordSchema } from "@/schemas/record/record";

export const recordFormValuesSchema = recordSchema
  .pick({
    title: true,
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
    memo: true,
  })
  .extend({ watchedAt: z.iso.date() })
  .partial({ releaseYear: true, platform: true, score: true });

export type RecordFormValues = z.infer<typeof recordFormValuesSchema>;

export type SelectOption = { value: string; label: string };
