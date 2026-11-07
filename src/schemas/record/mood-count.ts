import { z } from "zod";
import { moodTagSchema } from "@/schemas/record/enums";

export const moodCountListResponseSchema = z
  .object({
    mood_tag_counts: z.array(
      z.object({
        mood_tag: moodTagSchema,
        count: z.number().int().min(0),
      }),
    ),
  })
  .transform((r) =>
    r.mood_tag_counts.map(({ mood_tag, count }) => ({
      moodTag: mood_tag,
      count,
    })),
  );

export type MoodCount = z.output<typeof moodCountListResponseSchema>[number];
