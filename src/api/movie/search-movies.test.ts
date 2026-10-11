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

const { searchMovies } = await import("@/api/movie/search-movies");

describe("searchMovies", () => {
  it("searches by title in the given language", async () => {
    apiFetch.mockResolvedValue([]);
    await searchMovies("千と千尋", "ja");
    expect(apiFetch.mock.calls[0]?.[0]).toBe(
      `/movies/search?${new URLSearchParams({ title: "千と千尋", language: "ja" })}`,
    );
  });
});
