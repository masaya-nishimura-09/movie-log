import { apiFetch } from "@/api/client/api-fetch";
import type { Locale } from "@/i18n/locales";
import {
  type MovieSuggestion,
  movieSuggestionsResponseSchema,
} from "@/schemas/movie/movie";

export async function searchMovies(
  title: string,
  lang: Locale,
): Promise<MovieSuggestion[]> {
  const params = new URLSearchParams({ title, language: lang });
  return apiFetch(`/movies/search?${params}`, movieSuggestionsResponseSchema);
}
