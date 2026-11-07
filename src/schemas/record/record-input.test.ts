import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  recordInputSchema,
  toRecordRequest,
} from "@/schemas/record/record-input";

const validInput = {
  title: "Arrival",
  originalTitle: "Story of Your Life",
  overview: "Linguists meet aliens.",
  watchedAt: "2026-10-01T12:00:00Z",
  score: "5",
  platform: "netflix",
  releaseYear: "2016",
  runtime: "116",
  genres: ["drama", "science_fiction"],
  countries: ["US"],
  language: "en",
  credits: [{ personName: "Denis Villeneuve", creditRole: "director" }],
  posterUrl: "https://example.com/arrival.jpg",
  moodTags: ["moving"],
  memo: "",
};

function issuePaths(input: Record<string, unknown>) {
  const result = recordInputSchema.safeParse({ ...validInput, ...input });
  return result.success ? [] : result.error.issues.map((i) => i.path[0]);
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-11T00:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("recordInputSchema", () => {
  it("accepts a valid input and converts the numbers", () => {
    const result = recordInputSchema.parse(validInput);
    expect(result).toMatchObject({ score: 5, releaseYear: 2016, runtime: 116 });
  });

  it("rejects a watch date in the future", () => {
    expect(issuePaths({ watchedAt: "2026-10-12T00:00:00Z" })).toEqual([
      "watchedAt",
    ]);
  });

  it("accepts release years from 1888 to five years ahead", () => {
    expect(issuePaths({ releaseYear: "1888" })).toEqual([]);
    expect(issuePaths({ releaseYear: "2031" })).toEqual([]);
    expect(issuePaths({ releaseYear: "1887" })).toEqual(["releaseYear"]);
    expect(issuePaths({ releaseYear: "2032" })).toEqual(["releaseYear"]);
  });

  it("accepts a runtime from 0 to 1440 minutes", () => {
    expect(issuePaths({ runtime: "0" })).toEqual([]);
    expect(issuePaths({ runtime: "1440" })).toEqual([]);
    expect(issuePaths({ runtime: "1441" })).toEqual(["runtime"]);
  });

  it("accepts an empty poster URL or an http(s) URL only", () => {
    expect(issuePaths({ posterUrl: "" })).toEqual([]);
    expect(issuePaths({ posterUrl: "http://example.com/a.jpg" })).toEqual([]);
    expect(issuePaths({ posterUrl: "javascript:alert(1)" })).toEqual([
      "posterUrl",
    ]);
  });

  it("accepts two-letter uppercase country codes only", () => {
    expect(issuePaths({ countries: ["us"] })).toEqual(["countries"]);
    expect(issuePaths({ countries: ["USA"] })).toEqual(["countries"]);
  });

  it("rejects values outside the enums", () => {
    expect(issuePaths({ score: "6" })).toEqual(["score"]);
    expect(issuePaths({ platform: "unknown" })).toEqual(["platform"]);
    expect(issuePaths({ genres: ["unknown"] })).toEqual(["genres"]);
  });
});

describe("recordInputSchema: 原題とあらすじ", () => {
  it("accepts an original title up to 255 characters and an overview up to 2000", () => {
    expect(
      issuePaths({
        originalTitle: "a".repeat(255),
        overview: "a".repeat(2000),
      }),
    ).toEqual([]);
    expect(
      issuePaths({
        originalTitle: "a".repeat(256),
        overview: "a".repeat(2001),
      }),
    ).toEqual(["originalTitle", "overview"]);
  });

  it("accepts an empty original title and overview", () => {
    expect(issuePaths({ originalTitle: "", overview: "" })).toEqual([]);
  });
});

describe("toRecordRequest", () => {
  it("converts the input to the API's snake_case fields", () => {
    expect(toRecordRequest(recordInputSchema.parse(validInput))).toEqual({
      title: "Arrival",
      original_title: "Story of Your Life",
      overview: "Linguists meet aliens.",
      release_year: 2016,
      runtime: 116,
      genres: ["drama", "science_fiction"],
      countries: ["US"],
      language: "en",
      credits: [{ person_name: "Denis Villeneuve", credit_role: "director" }],
      poster_url: "https://example.com/arrival.jpg",
      watched_at: "2026-10-01T12:00:00Z",
      platform: "netflix",
      score: 5,
      mood_tags: ["moving"],
      memo: "",
    });
  });
});
