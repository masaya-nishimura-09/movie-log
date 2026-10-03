"use server";

import { getMovie } from "@/api/movie/get-movie";
import { searchMovies } from "@/api/movie/search-movies";
import type { Locale } from "@/i18n/locales";
import type { MovieSuggestion, MovieValues } from "@/schemas/movie/movie";

const maxSuggestions = 8;

export async function searchMoviesAction(
  lang: Locale,
  title: string,
): Promise<MovieSuggestion[]> {
  try {
    return (await searchMovies(title, lang)).slice(0, maxSuggestions);
  } catch {
    return [];
  }
}

export async function getMovieAction(
  lang: Locale,
  movieId: string,
): Promise<MovieValues | undefined> {
  try {
    return await getMovie(movieId, lang);
  } catch {
    return undefined;
  }
}
