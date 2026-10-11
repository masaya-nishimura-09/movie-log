import { describe, expect, it } from "vitest";
import { mock } from "@/api/mock/mock-record-factory";

describe("mock", () => {
  it("builds a record created two hours after it was watched", () => {
    const record = mock(3, {
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
      memo: "",
    });
    expect(record).toMatchObject({
      record_id: "3",
      title: "Arrival",
      created_at: "2026-10-01T14:00:00.000Z",
      updated_at: "2026-10-01T14:00:00.000Z",
    });
  });
});
