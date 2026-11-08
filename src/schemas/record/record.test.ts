import { describe, expect, it } from "vitest";
import {
  recordDetailResponseSchema,
  recordResponseSchema,
} from "@/schemas/record/record";

describe("recordResponseSchema", () => {
  it("converts the API response to camelCase", () => {
    expect(
      recordResponseSchema.parse({
        record_id: "1",
        title: "Arrival",
        original_title: "Story of Your Life",
        overview: "Linguists meet aliens.",
        release_year: 2016,
        runtime: 116,
        genres: ["drama"],
        countries: ["US"],
        language: "en",
        credits: [{ person_name: "Amy Adams", credit_role: "cast" }],
        poster_url: "",
        watched_at: "2026-10-01T12:00:00Z",
        platform: "netflix",
        score: 5,
        mood_tags: ["moving"],
        created_at: "2026-10-01T12:00:00Z",
        updated_at: "2026-10-02T12:00:00Z",
      }),
    ).toEqual({
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
      posterUrl: "",
      watchedAt: "2026-10-01T12:00:00Z",
      platform: "netflix",
      score: 5,
      moodTags: ["moving"],
      createdAt: "2026-10-01T12:00:00Z",
      updatedAt: "2026-10-02T12:00:00Z",
    });
  });

  it("uses empty strings when the API has no original title or overview", () => {
    const parsed = recordResponseSchema.parse({
      record_id: "1",
      title: "Arrival",
      release_year: 2016,
      runtime: 116,
      genres: [],
      countries: [],
      language: "en",
      credits: [],
      poster_url: "",
      watched_at: "2026-10-01T12:00:00Z",
      platform: "netflix",
      score: 5,
      mood_tags: [],
      created_at: "2026-10-01T12:00:00Z",
      updated_at: "2026-10-02T12:00:00Z",
    });
    expect(parsed).toMatchObject({ originalTitle: "", overview: "" });
  });
});

describe("recordDetailResponseSchema", () => {
  const response = {
    record_id: "1",
    title: "Arrival",
    release_year: 2016,
    runtime: 116,
    genres: [],
    countries: [],
    language: "en",
    credits: [],
    poster_url: "",
    watched_at: "2026-10-01T12:00:00Z",
    platform: "netflix",
    score: 5,
    mood_tags: [],
    created_at: "2026-10-01T12:00:00Z",
    updated_at: "2026-10-02T12:00:00Z",
  };

  it("converts the note to camelCase", () => {
    const content = { type: "doc", content: [] };
    expect(
      recordDetailResponseSchema.parse({
        ...response,
        note: {
          content,
          created_at: "2026-10-03T12:00:00Z",
          updated_at: "2026-10-04T12:00:00Z",
        },
      }).note,
    ).toEqual({
      content,
      createdAt: "2026-10-03T12:00:00Z",
      updatedAt: "2026-10-04T12:00:00Z",
    });
  });

  it("treats a missing or null note as no note", () => {
    expect(recordDetailResponseSchema.parse(response).note).toBeNull();
    expect(
      recordDetailResponseSchema.parse({ ...response, note: null }).note,
    ).toBeNull();
  });
});
