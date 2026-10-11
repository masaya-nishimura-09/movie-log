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

const { updateRecord } = await import("@/api/record/update-record");

describe("updateRecord", () => {
  it("puts the record to /records/{id} in the API format", async () => {
    apiFetch.mockResolvedValue({ recordId: "1" });
    await updateRecord("1", input);
    const [path, , init] = apiFetch.mock.calls[0] ?? [];
    expect(path).toBe("/records/1");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body)).toMatchObject({ title: "Arrival" });
  });
});
