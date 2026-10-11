import { beforeEach, describe, expect, it, vi } from "vitest";

const apiFetch = vi.fn();

vi.mock("@/api/client/api-fetch", () => ({ apiFetch }));
vi.mock("@/api/client/request-json", () => ({
  jsonBody: (body: unknown, method = "POST") => ({
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }),
}));

beforeEach(() => {
  apiFetch.mockReset();
});

const input = {
  title: "Arrival",
  watchedAt: "2026-10-01T12:00:00Z",
  score: 5 as const,
  platform: "netflix" as const,
  releaseYear: 2016,
  runtime: 116,
  genres: ["drama" as const],
  countries: ["US"],
  language: "en",
  credits: [{ personName: "Amy Adams", creditRole: "cast" as const }],
  posterUrl: "",
  moodTags: ["moving" as const],
  memo: "",
};

const { createRecord } = await import("@/api/record/create-record");

describe("createRecord", () => {
  it("posts the record to /records/ in the API format", async () => {
    apiFetch.mockResolvedValue({ recordId: "1" });
    await expect(createRecord(input)).resolves.toEqual({ recordId: "1" });
    const [path, , init] = apiFetch.mock.calls[0] ?? [];
    expect(path).toBe("/records/");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toMatchObject({
      title: "Arrival",
      release_year: 2016,
      watched_at: "2026-10-01T12:00:00Z",
      credits: [{ person_name: "Amy Adams", credit_role: "cast" }],
      mood_tags: ["moving"],
    });
  });
});
