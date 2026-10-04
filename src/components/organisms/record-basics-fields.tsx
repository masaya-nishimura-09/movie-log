"use client";

import { useEffect, useState } from "react";
import { ChoiceChip } from "@/components/atoms/choice-chip";
import { Input } from "@/components/atoms/input";
import { FormField } from "@/components/molecules/form-field";
import { MovieTitleField } from "@/components/molecules/movie-title-field";
import type { Dictionary } from "@/i18n/get-dictionary";
import { toDateInputValue } from "@/lib/date/format-date";
import { fieldError, type RecordFieldErrors } from "@/lib/record/field-error";
import { cn } from "@/lib/style/cn";
import type { MovieSuggestion } from "@/schemas/movie/movie";
import { platformSchema, scores } from "@/schemas/record/enums";
import type { RecordFormValues } from "@/schemas/record/record-form";

type RecordBasicsFieldsProps = {
  values: RecordFormValues;
  title: string;
  onTitleChange: (title: string) => void;
  searchMovies: (title: string) => Promise<MovieSuggestion[]>;
  onMovieSelect: (movieId: string) => void;
  errors?: RecordFieldErrors;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  counterTemplate: string;
  split?: boolean;
};

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toDateInputValue(date);
}

export function RecordBasicsFields({
  values,
  title,
  onTitleChange,
  searchMovies,
  onMovieSelect,
  errors,
  dict,
  enums,
  counterTemplate,
  split = false,
}: RecordBasicsFieldsProps) {
  const [watchedAt, setWatchedAt] = useState("");
  useEffect(() => {
    setWatchedAt(
      values.watchedAt === ""
        ? daysAgo(0)
        : toDateInputValue(new Date(values.watchedAt)),
    );
  }, [values.watchedAt]);
  const quickDates = [
    { label: dict.today, value: daysAgo(0) },
    { label: dict.yesterday, value: daysAgo(1) },
  ];

  return (
    <div
      className={cn(
        "flex flex-col gap-4.5",
        split && "xl:grid xl:grid-cols-2 xl:items-start xl:gap-8",
      )}
    >
      <div className={split ? "flex flex-col gap-4.5" : "contents"}>
        <FormField
          label={dict.title}
          error={fieldError(errors, dict, "title")}
          hint={dict.titleHint}
          htmlFor="title"
          required
          requiredLabel={dict.required}
        >
          <MovieTitleField
            id="title"
            name="title"
            required
            maxLength={255}
            value={title}
            onValueChange={onTitleChange}
            search={searchMovies}
            onSelect={onMovieSelect}
            counterTemplate={counterTemplate}
            listLabel={dict.movieSuggestions}
          />
        </FormField>

        <div
          className={cn(
            "grid gap-4.5 md:grid-cols-2 md:gap-4",
            split && "xl:grid-cols-1",
          )}
        >
          <FormField
            label={dict.watchedAt}
            error={fieldError(errors, dict, "watchedAt")}
            htmlFor="watchedAt"
            required
            requiredLabel={dict.required}
          >
            <Input
              id="watchedAt"
              name="watchedAt"
              type="date"
              required
              value={watchedAt}
              onChange={(event) => setWatchedAt(event.target.value)}
              className="tabular-nums"
            />
            <div className="mt-0.75 flex gap-1.5">
              {quickDates.map((quick) => (
                <button
                  key={quick.label}
                  type="button"
                  onClick={() => setWatchedAt(quick.value)}
                  className={cn(
                    "rounded-full px-2.75 py-1.25 text-xs",
                    watchedAt === quick.value
                      ? "bg-selected text-selected-foreground"
                      : "bg-secondary text-foreground-sub hover:text-foreground",
                  )}
                >
                  {quick.label}
                </button>
              ))}
            </div>
          </FormField>

          <FormField
            label={dict.score}
            error={fieldError(errors, dict, "score")}
            required
            requiredLabel={dict.required}
            hint={dict.scoreHint}
          >
            <div
              className="flex gap-1.75"
              role="radiogroup"
              aria-label={dict.score}
            >
              {scores.toReversed().map((score) => (
                <ChoiceChip
                  key={score}
                  type="radio"
                  name="score"
                  value={score}
                  required
                  defaultChecked={values.score === score}
                  shape="block"
                  size="lg"
                  tone="field"
                  className="h-13 min-w-0 px-0 md:h-11"
                >
                  {score}
                </ChoiceChip>
              ))}
            </div>
          </FormField>
        </div>
      </div>

      <FormField
        label={dict.platform}
        error={fieldError(errors, dict, "platform")}
        required
        requiredLabel={dict.required}
      >
        <div
          className="flex flex-wrap gap-1.75"
          role="radiogroup"
          aria-label={dict.platform}
        >
          {platformSchema.options.map((platform) => (
            <ChoiceChip
              key={platform}
              type="radio"
              name="platform"
              value={platform}
              required
              defaultChecked={values.platform === platform}
              className="h-10 md:h-9.5"
            >
              {enums.platform[platform]}
            </ChoiceChip>
          ))}
        </div>
      </FormField>
    </div>
  );
}
