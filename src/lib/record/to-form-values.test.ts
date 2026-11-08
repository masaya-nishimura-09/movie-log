import { describe, expect, it } from "vitest";
import {
  emptyFormValues,
  maxReleaseYear,
  toFormValues,
} from "@/lib/record/to-form-values";
import type { RecordDetail } from "@/schemas/record/record";

const noteContent = {
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text: "ノート" }] }],
};

const record: RecordDetail = {
  recordId: "1",
  title: "Arrival",
  originalTitle: "Story of Your Life",
  overview: "Linguists meet aliens.",
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
  createdAt: "2026-10-01T12:00:00Z",
  updatedAt: "2026-10-02T12:00:00Z",
  note: noteContent,
};

describe("emptyFormValues", () => {
  it("returns the values for a new record", () => {
    expect(emptyFormValues()).toEqual({
      title: "",
      originalTitle: "",
      overview: "",
      watchedAt: "",
      runtime: 0,
      genres: [],
      countries: [],
      language: "ja",
      credits: [],
      posterUrl: "",
      moodTags: [],
    });
  });
});

describe("toFormValues", () => {
  it("copies the editable fields of a record, with the note's content", () => {
    const {
      recordId: _,
      createdAt: __,
      updatedAt: ___,
      note: ____,
      ...editable
    } = record;
    expect(toFormValues(record)).toEqual({ ...editable, note: noteContent });
  });

  it("leaves the note empty when the record has none", () => {
    expect(toFormValues({ ...record, note: null }).note).toBeUndefined();
  });
});

describe("maxReleaseYear", () => {
  it("is five years after the given date", () => {
    expect(maxReleaseYear(new Date("2026-10-11T00:00:00"))).toBe(2031);
  });
});
