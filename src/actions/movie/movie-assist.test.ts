import { beforeEach, describe, expect, it, vi } from "vitest";

const searchMovies = vi.fn();
const getMovie = vi.fn();

vi.mock("@/api/movie/search-movies", () => ({ searchMovies }));
vi.mock("@/api/movie/get-movie", () => ({ getMovie }));

const { getMovieAction, searchMoviesAction } = await import(
  "@/actions/movie/movie-assist"
);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("searchMoviesAction", () => {
  it("returns up to 8 suggestions in the given language", async () => {
    searchMovies.mockResolvedValue(
      Array.from({ length: 10 }, (_, i) => ({ movieId: String(i) })),
    );
    const suggestions = await searchMoviesAction("en", "Arrival");
    expect(suggestions).toHaveLength(8);
    expect(searchMovies).toHaveBeenCalledWith("Arrival", "en");
  });

  it("returns no suggestions when the search fails", async () => {
    searchMovies.mockRejectedValue(new Error("failed"));
    await expect(searchMoviesAction("ja", "Arrival")).resolves.toEqual([]);
  });
});

describe("getMovieAction", () => {
  it("returns the movie in the given language", async () => {
    getMovie.mockResolvedValue({ title: "Arrival" });
    await expect(getMovieAction("en", "1")).resolves.toEqual({
      title: "Arrival",
    });
    expect(getMovie).toHaveBeenCalledWith("1", "en");
  });

  it("returns undefined when getting the movie fails", async () => {
    getMovie.mockRejectedValue(new Error("failed"));
    await expect(getMovieAction("ja", "1")).resolves.toBeUndefined();
  });
});
