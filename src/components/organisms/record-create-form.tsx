"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  type FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import { useMovieAssist } from "@/components/molecules/movie-title-field";
import { RecordBasicsFields } from "@/components/organisms/record-basics-fields";
import { RecordImpressionFields } from "@/components/organisms/record-impression-fields";
import { RecordMovieFields } from "@/components/organisms/record-movie-fields";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { startOfLocalDay } from "@/lib/date/start-of-local-day";
import { buildLanguageOptions } from "@/lib/record/language-options";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";
import type { MovieSuggestion, MovieValues } from "@/schemas/movie/movie";
import type {
  RecordFormValues,
  SelectOption,
} from "@/schemas/record/record-form";

type RecordCreateFormProps = {
  lang: Locale;
  action: (
    previous: ActionResult<never> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<never>>;
  searchMovies: (title: string) => Promise<MovieSuggestion[]>;
  getMovie: (movieId: string) => Promise<MovieValues | undefined>;
  uploadPoster: (formData: FormData) => Promise<ActionResult<string>>;
  values: RecordFormValues;
  languageOptions: SelectOption[];
  maxReleaseYear: number;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  counterTemplate: string;
};

const fieldSteps: Record<string, number> = {
  title: 0,
  watchedAt: 0,
  score: 0,
  platform: 0,
  releaseYear: 1,
  runtime: 1,
  language: 1,
  countries: 1,
  genres: 1,
  credits: 1,
  posterUrl: 1,
  moodTags: 2,
  memo: 2,
};

export function RecordCreateForm({
  lang,
  action,
  searchMovies,
  getMovie,
  uploadPoster,
  values,
  languageOptions,
  maxReleaseYear,
  dict,
  enums,
  counterTemplate,
}: RecordCreateFormProps) {
  const [step, setStep] = useState(0);
  const steps = [dict.stepBasics, dict.stepMovieInfo, dict.stepImpression];
  const [state, formAction, pending] = useActionState(action, undefined);
  const movie = useMovieAssist(values, getMovie);
  const movieLanguageOptions =
    movie.version === 0
      ? languageOptions
      : buildLanguageOptions(lang, movie.values.language, dict.languageUnknown);
  const failure = state?.success === false ? state : undefined;
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fields = Object.keys(failure?.errors ?? {});
    const steps = fields.map((field) => fieldSteps[field] ?? 0);
    if (steps.length > 0) setStep(Math.min(...steps));
  }, [failure]);

  const goNext = () => {
    const invalid = stepRefs.current[step]?.querySelector<HTMLInputElement>(
      "input:invalid, textarea:invalid",
    );
    if (invalid) {
      invalid.reportValidity();
      return;
    }
    setStep(step + 1);
  };

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
    <form onSubmit={submit} noValidate className="flex w-full flex-1 flex-col">
      <header className="flex flex-col gap-3.5 bg-background px-4 pt-4 pb-3.5 md:px-10 md:pt-6 md:pb-0">
        <ol className="flex gap-2">
          {steps.map((label, index) => (
            <li
              key={label}
              aria-current={index === step ? "step" : undefined}
              className="flex flex-1 flex-col gap-1.5"
            >
              <span
                className={cn(
                  "h-1 rounded-full",
                  index <= step ? "bg-selected-border" : "bg-input",
                )}
              />
              <span
                className={cn(
                  "hidden text-xs md:block",
                  index === step
                    ? "font-bold text-selected-foreground"
                    : "text-muted-foreground",
                )}
              >
                {index + 1}. {label}
              </span>
            </li>
          ))}
        </ol>
        <p className="text-foreground-sub text-xs md:hidden" aria-live="polite">
          {interpolate(dict.stepProgress, {
            current: step + 1,
            total: steps.length,
          })}
          {` ・ ${steps[step]}`}
        </p>
      </header>

      <div className="flex-1 px-4 py-5.5 md:flex-none md:px-10 md:pb-2">
        <div className="rounded-[18px] bg-card p-4.5 md:p-5.5">
          {failure && (
            <p
              role="alert"
              className="mb-4.5 rounded-lg bg-destructive/10 px-3.5 py-2.5 text-destructive-foreground text-sm"
            >
              {failure.messageKey === "notFound"
                ? dict.notFound
                : failure.messageKey === "invalidInput"
                  ? dict.invalidInput
                  : dict.unexpectedError}
            </p>
          )}
          <div
            hidden={step !== 0}
            ref={(el) => {
              stepRefs.current[0] = el;
            }}
          >
            <RecordBasicsFields
              lang={lang}
              split
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
          </div>
          <div
            hidden={step !== 1}
            ref={(el) => {
              stepRefs.current[1] = el;
            }}
            className="flex flex-col gap-4.5"
          >
            <div className="flex items-baseline gap-2">
              <h2 className="font-bold text-base text-foreground">
                {dict.stepMovieInfo}
              </h2>
              <span className="text-muted-foreground text-xs">
                {dict.movieInfoHint}
              </span>
            </div>
            <RecordMovieFields
              split
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
          </div>
          <div
            hidden={step !== 2}
            ref={(el) => {
              stepRefs.current[2] = el;
            }}
            className="flex flex-col gap-4.5"
          >
            <div className="flex items-baseline gap-2">
              <h2 className="font-bold text-base text-foreground">
                {dict.impressionHeading}
              </h2>
              <span className="text-muted-foreground text-xs">
                {dict.optional}
              </span>
            </div>
            <RecordImpressionFields
              split
              errors={failure?.errors}
              values={values}
              dict={dict}
              enums={enums}
              counterTemplate={counterTemplate}
            />
          </div>
        </div>
      </div>

      <footer className="flex items-center gap-2 px-4 pt-3 pb-4 md:mx-10 md:mb-8 md:px-0 md:pt-2 md:pb-0">
        {step > 0 && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft className="size-4.5" aria-hidden />
            {dict.back}
          </Button>
        )}
        {step < steps.length - 1 ? (
          <Button
            key="next"
            type="button"
            onClick={goNext}
            className="ml-auto h-12 flex-1 md:h-11 md:flex-none md:px-4.5"
          >
            {dict.next}
            <ArrowRight className="size-4.5" aria-hidden />
          </Button>
        ) : (
          <Button
            key="save"
            type="submit"
            disabled={pending}
            className="ml-auto h-12 flex-1 md:h-11 md:flex-none md:px-4.5"
          >
            {dict.save}
          </Button>
        )}
      </footer>
    </form>
  );
}
