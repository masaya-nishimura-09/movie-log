import { describe, expect, it } from "vitest";
import {
  emptyFormValues,
  maxReleaseYear,
  toFormValues,
} from "@/lib/record/to-form-values";
import type { MovieRecord } from "@/schemas/record/record";

const record: MovieRecord = {
  recordId: "1",
  title: "Arrival",
  releaseYear: 2016,
  runtime: 116,
  genres: ["drama"],
  countries: ["US"],
  language: "en",
  credits: [{ personName: "Amy Adams", creditRole: "cast" }],
  posterUrl: "https://example.com/a.jpg",
  watchedAt: "2026-10-01T12:00:00Z",
  platform: "netflix",
  score: 5,
  moodTags: ["moving"],
  memo: "memo",
  createdAt: "2026-10-01T12:00:00Z",
  updatedAt: "2026-10-02T12:00:00Z",
};

describe("emptyFormValues", () => {
  it("returns the values for a new record", () => {
    expect(emptyFormValues()).toEqual({
      title: "",
      watchedAt: "",
      runtime: 0,
      genres: [],
      countries: [],
      language: "ja",
      credits: [],
      posterUrl: "",
      moodTags: [],
      memo: "",
    });
  });
});

describe("toFormValues", () => {
  it("copies the editable fields of a record", () => {
    const { recordId: _, createdAt: __, updatedAt: ___, ...editable } = record;
    expect(toFormValues(record)).toEqual(editable);
  });
});

describe("maxReleaseYear", () => {
  it("is five years after the given date", () => {
    expect(maxReleaseYear(new Date("2026-10-11T00:00:00"))).toBe(2031);
  });
});
