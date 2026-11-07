import { type MoodTag, moodTagSchema } from "@/schemas/record/enums";
import type { MoodCount } from "@/schemas/record/mood-count";

const moodShelfLimit = 3;
const moodShelfMinRecords = 2;

export function pickShelfMoods(counts: MoodCount[]): MoodTag[] {
  const countOf = new Map(counts.map(({ moodTag, count }) => [moodTag, count]));
  return moodTagSchema.options
    .map((moodTag) => ({ moodTag, count: countOf.get(moodTag) ?? 0 }))
    .filter(({ count }) => count >= moodShelfMinRecords)
    .sort((a, b) => b.count - a.count)
    .slice(0, moodShelfLimit)
    .map(({ moodTag }) => moodTag);
}
