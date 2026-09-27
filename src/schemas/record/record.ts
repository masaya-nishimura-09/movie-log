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
