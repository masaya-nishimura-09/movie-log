import { apiFetch } from "@/api/client/api-fetch";
import {
  type MoodCount,
  moodCountListResponseSchema,
} from "@/schemas/record/mood-count";

export async function getMoodCounts(): Promise<MoodCount[]> {
  return apiFetch("/records/mood-counts", moodCountListResponseSchema);
}
