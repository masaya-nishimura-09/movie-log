"use client";

import Link from "next/link";
import {
  type FormEvent,
  type ReactNode,
  startTransition,
  useActionState,
} from "react";
import type { ActionResult } from "@/actions/action-result";
import { Button, buttonVariants } from "@/components/atoms/button";
import { useMovieAssist } from "@/components/molecules/movie-title-field";
import { RecordBasicsFields } from "@/components/organisms/record-basics-fields";
import { RecordImpressionFields } from "@/components/organisms/record-impression-fields";
import { RecordMovieFields } from "@/components/organisms/record-movie-fields";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { startOfLocalDay } from "@/lib/date/start-of-local-day";
import { buildLanguageOptions } from "@/lib/record/language-options";
import type { MovieSuggestion, MovieValues } from "@/schemas/movie/movie";
import type {
  RecordFormValues,
  SelectOption,
} from "@/schemas/record/record-form";

type RecordEditFormProps = {
  lang: Locale;
  action: (
    previous: ActionResult<never> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<never>>;
  searchMovies: (title: string) => Promise<MovieSuggestion[]>;
  getMovie: (movieId: string) => Promise<MovieValues | undefined>;
  uploadPoster: (formData: FormData) => Promise<ActionResult<string>>;
  backHref: string;
  values: RecordFormValues;
  languageOptions: SelectOption[];
  maxReleaseYear: number;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  counterTemplate: string;
};

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4.5 rounded-[18px] bg-card p-4.5 md:p-5.5">
      <h2 className="font-bold text-base text-foreground">{title}</h2>
      {children}
    </section>
  );
}

export function RecordEditForm({
  lang,
  action,
  searchMovies,
  getMovie,
  uploadPoster,
  backHref,
  values,
  languageOptions,
  maxReleaseYear,
  dict,
  enums,
  counterTemplate,
}: RecordEditFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const movie = useMovieAssist(values, getMovie);
  const movieLanguageOptions =
    movie.version === 0
      ? languageOptions
      : buildLanguageOptions(lang, movie.values.language, dict.languageUnknown);
  const failure = state?.success === false ? state : undefined;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set(
      "watchedAt",
      startOfLocalDay(String(formData.get("watchedAt") ?? "")),
    );
    startTransition(() => formAction(formData));
  };

  return (
    <form
      onSubmit={submit}
      noValidate
      className="flex w-full flex-col gap-4 px-4 pt-5 md:px-10 md:pt-8"
    >
      {failure && (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 px-3.5 py-2.5 text-destructive-foreground text-sm"
        >
          {failure.messageKey === "notFound"
            ? dict.notFound
            : failure.messageKey === "invalidInput"
              ? dict.invalidInput
              : dict.unexpectedError}
        </p>
      )}
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Panel title={dict.watchSection}>
            <RecordBasicsFields
              errors={failure?.errors}
              title={movie.title}
              onTitleChange={movie.setTitle}
              searchMovies={searchMovies}
              onMovieSelect={movie.select}
              values={values}
              dict={dict}
              enums={enums}
              counterTemplate={counterTemplate}
            />
          </Panel>
          <Panel title={dict.stepImpression}>
            <RecordImpressionFields
              errors={failure?.errors}
              values={values}
              dict={dict}
              enums={enums}
              counterTemplate={counterTemplate}
            />
          </Panel>
        </div>
        <Panel title={dict.movieSection}>
          <RecordMovieFields
            errors={failure?.errors}
            key={movie.version}
            lang={lang}
            values={movie.values}
            languageOptions={movieLanguageOptions}
            maxReleaseYear={maxReleaseYear}
            uploadPoster={uploadPoster}
            dict={dict}
            enums={enums}
          />
        </Panel>
      </div>

      <div className="mb-6 flex justify-end gap-2 rounded-[18px] bg-card px-4 py-3 md:px-5">
        <Link
          href={backHref}
          className={buttonVariants({ variant: "outline" })}
        >
          {dict.cancel}
        </Link>
        <Button type="submit" disabled={pending}>
          {dict.saveChanges}
        </Button>
      </div>
    </form>
  );
}
