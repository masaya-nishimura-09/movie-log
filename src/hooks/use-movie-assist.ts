import { useState } from "react";
import type { MovieValues } from "@/schemas/movie/movie";
import type { RecordFormValues } from "@/schemas/record/record-form";

export function useMovieAssist(
  initial: RecordFormValues,
  getMovie: (movieId: string) => Promise<MovieValues | undefined>,
) {
  const [title, setTitle] = useState(initial.title);
  const [values, setValues] = useState(initial);
  const [version, setVersion] = useState(0);

  const select = async (movieId: string) => {
    const movie = await getMovie(movieId);
    if (!movie) return;
    setTitle(movie.title);
    setValues((current) => ({ ...current, ...movie }));
    setVersion((current) => current + 1);
  };

  return { title, setTitle, values, version, select };
}
