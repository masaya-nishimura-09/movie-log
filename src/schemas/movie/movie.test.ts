import { describe, expect, it } from "vitest";
import {
  movieResponseSchema,
  movieSuggestionsResponseSchema,
} from "@/schemas/movie/movie";

describe("movieSuggestionsResponseSchema", () => {
  it("converts the suggestions and drops an unknown release year", () => {
    expect(
      movieSuggestionsResponseSchema.parse({
        page: 1,
        movies: [
          {
            id: 329865,
            title: "メッセージ",
            original_title: "Arrival",
            release_year: 2016,
          },
          {
            id: 1,
            title: "Unknown",
            original_title: "Unknown",
            release_year: 0,
          },
        ],
      }),
    ).toEqual([
      {
        movieId: "329865",
        title: "メッセージ",
        originalTitle: "Arrival",
        releaseYear: 2016,
      },
      {
        movieId: "1",
        title: "Unknown",
        originalTitle: "Unknown",
        releaseYear: undefined,
      },
    ]);
  });
});

describe("movieResponseSchema", () => {
  const response = {
    title: "メッセージ",
    genres: ["drama", "science_fiction", "unknown"],
    poster_url: "https://image.tmdb.org/t/p/w500/a.jpg",
    release_year: 2016,
    runtime: 116,
    original_language: "en",
    origin_country: ["US", "usa", "CA"],
    credits: [
      { person_name: "Cast 1", credit_role: "cast" },
      { person_name: "Denis Villeneuve", credit_role: "director" },
      { person_name: "Cast 2", credit_role: "cast" },
      { person_name: "Cast 3", credit_role: "cast" },
      { person_name: "Producer", credit_role: "producer" },
      { person_name: "Cast 4", credit_role: "cast" },
      { person_name: "Cast 5", credit_role: "cast" },
      { person_name: "Cast 6", credit_role: "cast" },
      { person_name: "Eric Heisserer", credit_role: "writer" },
    ],
  };

  it("converts the movie to form values", () => {
    expect(movieResponseSchema.parse(response)).toEqual({
      title: "メッセージ",
      releaseYear: 2016,
      runtime: 116,
      genres: ["drama", "science_fiction"],
      countries: ["US", "CA"],
      language: "en",
      credits: [
        { personName: "Denis Villeneuve", creditRole: "director" },
        { personName: "Eric Heisserer", creditRole: "writer" },
        { personName: "Cast 1", creditRole: "cast" },
        { personName: "Cast 2", creditRole: "cast" },
        { personName: "Cast 3", creditRole: "cast" },
        { personName: "Cast 4", creditRole: "cast" },
        { personName: "Cast 5", creditRole: "cast" },
      ],
      posterUrl: "https://image.tmdb.org/t/p/w500/a.jpg",
    });
  });

  it("uses und for an unknown language and drops an unknown release year", () => {
    const values = movieResponseSchema.parse({
      ...response,
      original_language: "",
      release_year: 0,
    });
    expect(values.language).toBe("und");
    expect(values.releaseYear).toBeUndefined();
  });
});
