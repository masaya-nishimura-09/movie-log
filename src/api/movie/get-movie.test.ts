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

const { getMovie } = await import("@/api/movie/get-movie");

describe("getMovie", () => {
  it("gets the movie in the given language, encoding the ID", async () => {
    apiFetch.mockResolvedValue({ title: "Arrival" });
    await getMovie("1/2", "en");
    expect(apiFetch.mock.calls[0]?.[0]).toBe("/movies/1%2F2?language=en");
  });
});
