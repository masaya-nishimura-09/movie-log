import { apiFetch } from "@/api/client/api-fetch";
import type { Locale } from "@/i18n/locales";
import { type MovieValues, movieResponseSchema } from "@/schemas/movie/movie";

export async function getMovie(
  movieId: string,
  lang: Locale,
): Promise<MovieValues> {
  const params = new URLSearchParams({ language: lang });
  return apiFetch(
    `/movies/${encodeURIComponent(movieId)}?${params}`,
    movieResponseSchema,
  );
}
