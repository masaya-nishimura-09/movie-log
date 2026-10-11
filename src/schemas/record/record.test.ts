import { describe, expect, it } from "vitest";
import { recordResponseSchema } from "@/schemas/record/record";

describe("recordResponseSchema", () => {
  it("converts the API response to camelCase", () => {
    expect(
      recordResponseSchema.parse({
        record_id: "1",
        title: "Arrival",
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
        memo: "memo",
        created_at: "2026-10-01T12:00:00Z",
        updated_at: "2026-10-02T12:00:00Z",
      }),
    ).toEqual({
      recordId: "1",
      title: "Arrival",
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
      memo: "memo",
      createdAt: "2026-10-01T12:00:00Z",
      updatedAt: "2026-10-02T12:00:00Z",
    });
  });
});
