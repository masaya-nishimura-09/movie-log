import { Temporal } from "@js-temporal/polyfill";
import { describe, expect, it } from "vitest";
import { pickMoodShelves, pickRecent, pickReminder } from "@/lib/home/shelves";
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

describe("pickReminder", () => {
  const records = ["3", "1", "4", "2", "5"].map((id) =>
    record(id, "2026-01-01T00:00:00Z"),
  );
  const day = (date: string) => Temporal.PlainDate.from(date);

  it("shows two records a day in ID order, moving two ahead each day", () => {
    const first = day("2026-10-24");
    const start = first.since(day("1970-01-01")).days;
    const pages = [0, 1, 2].map((offset) =>
      ids(pickReminder(records, first.add({ days: offset }))),
    );
    const order = ["1", "2", "3", "4", "5"];
    pages.forEach((page, offset) => {
      const index = ((start + offset) * 2) % order.length;
      expect(page).toEqual([order[index], order[(index + 1) % order.length]]);
    });
  });

  it("goes around every record and wraps at the end", () => {
    const seen = new Set(
      [0, 1, 2, 3, 4].flatMap((offset) =>
        ids(pickReminder(records, day("2026-10-24").add({ days: offset }))),
      ),
    );
    expect([...seen].sort()).toEqual(["1", "2", "3", "4", "5"]);
  });

  it("shows the same records all day long", () => {
    expect(ids(pickReminder(records, day("2026-10-24")))).toEqual(
      ids(pickReminder(records, day("2026-10-24"))),
    );
  });

  it("shows the only record once, and nothing without records", () => {
    expect(
      ids(
        pickReminder([record("9", "2026-01-01T00:00:00Z")], day("2026-10-24")),
      ),
    ).toEqual(["9"]);
    expect(pickReminder([], day("2026-10-24"))).toEqual([]);
  });
});

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
