import { describe, expect, it } from "vitest";
import { tocChapters } from "@/lib/record/toc-chapters";
import type { MovieRecord } from "@/schemas/record/record";

function record(
  id: string,
  watchedAt: string,
  score: MovieRecord["score"] = 3,
  releaseYear = 2000,
): MovieRecord {
  return {
    recordId: id,
    title: id,
    originalTitle: "",
    overview: "",
    releaseYear,
    runtime: 0,
    genres: [],
    countries: [],
    language: "",
    credits: [],
    posterUrl: "",
    watchedAt,
    platform: "netflix",
    score,
    moodTags: [],
    createdAt: watchedAt,
    updatedAt: watchedAt,
  };
}

const ids = (chapters: ReturnType<typeof tocChapters>) =>
  chapters.map((c) => [c.heading, c.records.map((r) => r.recordId)]);

describe("tocChapters", () => {
  it("groups records by the month they were watched in the given time zone", () => {
    const records = [
      record("a", "2026-09-10T03:00:00Z"),
      record("b", "2026-08-31T15:00:00Z"),
      record("c", "2026-08-20T03:00:00Z"),
    ];
    expect(ids(tocChapters(records, "watchedAtDesc", "Asia/Tokyo"))).toEqual([
      [{ kind: "month", year: 2026, month: 9 }, ["a", "b"]],
      [{ kind: "month", year: 2026, month: 8 }, ["c"]],
    ]);
    expect(ids(tocChapters(records, "watchedAtDesc", "UTC"))).toEqual([
      [{ kind: "month", year: 2026, month: 9 }, ["a"]],
      [{ kind: "month", year: 2026, month: 8 }, ["b", "c"]],
    ]);
  });

  it("groups records by score when sorted by score", () => {
    const records = [
      record("a", "2026-09-10T03:00:00Z", 5),
      record("b", "2026-08-10T03:00:00Z", 5),
      record("c", "2026-07-10T03:00:00Z", 4),
    ];
    expect(ids(tocChapters(records, "scoreDesc", "UTC"))).toEqual([
      [{ kind: "score", score: 5 }, ["a", "b"]],
      [{ kind: "score", score: 4 }, ["c"]],
    ]);
  });

  it("groups records by release year when sorted by release year", () => {
    const records = [
      record("a", "2026-09-10T03:00:00Z", 3, 1999),
      record("b", "2026-08-10T03:00:00Z", 3, 1980),
    ];
    expect(ids(tocChapters(records, "releaseYearDesc", "UTC"))).toEqual([
      [{ kind: "year", year: 1999 }, ["a"]],
      [{ kind: "year", year: 1980 }, ["b"]],
    ]);
  });

  it("puts every record in one chapter without a heading when sorted by title", () => {
    const records = [
      record("a", "2026-09-10T03:00:00Z"),
      record("b", "2026-08-10T03:00:00Z"),
    ];
    expect(ids(tocChapters(records, "titleAsc", "UTC"))).toEqual([
      [null, ["a", "b"]],
    ]);
  });
});
