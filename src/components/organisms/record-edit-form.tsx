"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { ActionResult } from "@/actions/action-result";
import { Button, buttonVariants } from "@/components/atoms/button";
import { FormAlert } from "@/components/atoms/form-alert";
import { RecordBasicsFields } from "@/components/organisms/record-basics-fields";
import { RecordImpressionFields } from "@/components/organisms/record-impression-fields";
import { RecordMovieFields } from "@/components/organisms/record-movie-fields";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { useMovieAssist } from "@/hooks/use-movie-assist";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { convertWatchedAt } from "@/lib/record/watched-at";
import { dictMessage } from "@/lib/text/dict-message";
import type { MovieSuggestion, MovieValues } from "@/schemas/movie/movie";
import type { RecordFormValues } from "@/schemas/record/record-form";

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
  maxReleaseYear,
  dict,
  enums,
  counterTemplate,
}: RecordEditFormProps) {
  const { failure, pending, submit } = useFormSubmit(action, convertWatchedAt);
  const movie = useMovieAssist(values, getMovie);

  return (
    <form
      onSubmit={submit}
      noValidate
      className="flex w-full flex-col gap-4 px-4 pt-5 md:px-10 md:pt-8"
    >
      {failure && (
        <FormAlert>
          {dictMessage(dict, failure.messageKey) ?? dict.unexpectedError}
        </FormAlert>
      )}
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Panel title={dict.watchSection}>
            <RecordBasicsFields
              lang={lang}
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
            maxReleaseYear={maxReleaseYear}
            uploadPoster={uploadPoster}
            dict={dict}
            enums={enums}
          />
        </Panel>
      </div>

      <div className="mb-6 flex justify-end gap-2">
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
