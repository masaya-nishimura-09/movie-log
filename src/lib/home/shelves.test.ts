import { describe, expect, it } from "vitest";
import { pickMoodShelves, pickRecent } from "@/lib/home/shelves";
import type { MoodTag } from "@/schemas/record/enums";
import type { MovieRecord } from "@/schemas/record/record";

function record(
  id: string,
  watchedAt: string,
  moodTags: MoodTag[] = [],
): MovieRecord {
  return {
    recordId: id,
    title: `T${id}`,
    releaseYear: 2000,
    runtime: 100,
    genres: [],
    countries: [],
    language: "ja",
    credits: [],
    posterUrl: "",
    watchedAt,
    platform: "netflix",
    score: 3,
    moodTags,
    memo: "",
    createdAt: watchedAt,
    updatedAt: watchedAt,
  };
}

const ids = (records: MovieRecord[]) => records.map((r) => r.recordId);

describe("pickRecent", () => {
  it("picks the twelve most recently watched records", () => {
    const records = Array.from({ length: 14 }, (_, i) =>
      record(String(i), `2026-01-${String(i + 1).padStart(2, "0")}T00:00:00Z`),
    );
    expect(ids(pickRecent(records))).toEqual([
      "13",
      "12",
      "11",
      "10",
      "9",
      "8",
      "7",
      "6",
      "5",
      "4",
      "3",
      "2",
    ]);
  });
});

describe("pickMoodShelves", () => {
  it("makes a shelf for each mood with two or more records, the largest first (ties in the defined order), up to three", () => {
    const shelves = pickMoodShelves([
      record("1", "2026-01-01T00:00:00Z", ["moving", "dark"]),
      record("2", "2026-01-02T00:00:00Z", ["moving", "dark"]),
      record("3", "2026-01-03T00:00:00Z", ["moving", "cozy"]),
      record("4", "2026-01-04T00:00:00Z", ["cozy", "epic"]),
      record("5", "2026-01-05T00:00:00Z", ["tense", "epic"]),
      record("6", "2026-01-06T00:00:00Z", ["surreal"]),
    ]);
    expect(shelves.map((s) => s.moodTag)).toEqual(["moving", "dark", "epic"]);
    expect(ids(shelves[0]?.records ?? [])).toEqual(["3", "2", "1"]);
  });

  it("puts at most twelve records on a shelf, newest first", () => {
    const records = Array.from({ length: 14 }, (_, i) =>
      record(String(i), `2026-01-${String(i + 1).padStart(2, "0")}T00:00:00Z`, [
        "moving",
      ]),
    );
    const [shelf] = pickMoodShelves(records);
    expect(shelf?.records).toHaveLength(12);
    expect(shelf?.records[0]?.recordId).toBe("13");
  });

  it("returns no shelf when no mood has two records", () => {
    expect(
      pickMoodShelves([record("1", "2026-01-01T00:00:00Z", ["moving"])]),
    ).toEqual([]);
  });
});
