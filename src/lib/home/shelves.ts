import { Temporal } from "@js-temporal/polyfill";
import { type MoodTag, moodTagSchema } from "@/schemas/record/enums";
import type { MovieRecord } from "@/schemas/record/record";

export type MoodShelf = { moodTag: MoodTag; records: MovieRecord[] };

const reminderCount = 2;
const recentLimit = 12;
const moodShelfLimit = 3;
const moodShelfMinRecords = 2;
const moodShelfSize = 12;

function byWatchedAtDesc(a: MovieRecord, b: MovieRecord): number {
  return b.watchedAt.localeCompare(a.watchedAt);
}

export function pickReminder(
  records: MovieRecord[],
  today: Temporal.PlainDate,
): MovieRecord[] {
  const ordered = [...records].sort(
    (a, b) => Number(a.recordId) - Number(b.recordId),
  );
  const count = Math.min(reminderCount, ordered.length);
  if (count === 0) return [];
  const day = today.since(Temporal.PlainDate.from("1970-01-01")).days;
  const start = (day * reminderCount) % ordered.length;
  return Array.from({ length: count }, (_, i) =>
    ordered.slice((start + i) % ordered.length).slice(0, 1),
  ).flat();
}

export function pickRecent(records: MovieRecord[]): MovieRecord[] {
  return [...records].sort(byWatchedAtDesc).slice(0, recentLimit);
}

export function pickMoodShelves(records: MovieRecord[]): MoodShelf[] {
  return moodTagSchema.options
    .map((moodTag) => ({
      moodTag,
      records: records
        .filter((record) => record.moodTags.includes(moodTag))
        .sort(byWatchedAtDesc),
    }))
    .filter((shelf) => shelf.records.length >= moodShelfMinRecords)
    .sort((a, b) => b.records.length - a.records.length)
    .slice(0, moodShelfLimit)
    .map((shelf) => ({
      ...shelf,
      records: shelf.records.slice(0, moodShelfSize),
    }));
}
