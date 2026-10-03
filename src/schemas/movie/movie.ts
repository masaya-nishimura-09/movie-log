import { z } from "zod";
import { creditRoleSchema, genreSchema } from "@/schemas/record/enums";
import type { RecordFormValues } from "@/schemas/record/record-form";

export const movieSuggestionsResponseSchema = z
  .object({
    movies: z.array(
      z.object({
        id: z.number().int(),
        title: z.string(),
        original_title: z.string(),
        release_year: z.number().int(),
      }),
    ),
  })
  .transform((r) =>
    r.movies.map((movie) => ({
      movieId: String(movie.id),
      title: movie.title,
      originalTitle: movie.original_title,
      releaseYear: movie.release_year || undefined,
    })),
  );

export type MovieSuggestion = z.output<
  typeof movieSuggestionsResponseSchema
>[number];

const maxCast = 5;

export type MovieValues = Pick<
  RecordFormValues,
  | "title"
  | "releaseYear"
  | "runtime"
  | "genres"
  | "countries"
  | "language"
  | "credits"
  | "posterUrl"
>;

export const movieResponseSchema = z
  .object({
    title: z.string(),
    genres: z.array(z.string()),
    poster_url: z.string(),
    release_year: z.number().int(),
    runtime: z.number().int(),
    original_language: z.string(),
    origin_country: z.array(z.string()),
    credits: z.array(
      z.object({ person_name: z.string(), credit_role: z.string() }),
    ),
  })
  .transform((r): MovieValues => {
    const credits = r.credits.flatMap((credit) => {
      const role = creditRoleSchema.safeParse(credit.credit_role);
      return role.success
        ? [{ personName: credit.person_name, creditRole: role.data }]
        : [];
    });
    const cast = credits.filter((c) => c.creditRole === "cast");
    return {
      title: r.title,
      releaseYear: r.release_year || undefined,
      runtime: r.runtime,
      genres: r.genres.flatMap((genre) => {
        const parsed = genreSchema.safeParse(genre);
        return parsed.success ? [parsed.data] : [];
      }),
      countries: r.origin_country.filter((code) => /^[A-Z]{2}$/.test(code)),
      language: r.original_language || "und",
      credits: [
        ...credits.filter((c) => c.creditRole !== "cast"),
        ...cast.slice(0, maxCast),
      ],
      posterUrl: r.poster_url,
    };
  });
