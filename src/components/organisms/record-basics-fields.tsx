"use client";

import { type ReactNode, useEffect, useState } from "react";
import type { ActionResult } from "@/actions/action-result";
import { ChoicePicker } from "@/components/molecules/choice-picker";
import { DatePickerField } from "@/components/molecules/date-picker-field";
import { MovieTitleField } from "@/components/molecules/movie-title-field";
import { NotebookField } from "@/components/molecules/notebook-field";
import { PosterPicker } from "@/components/molecules/poster-picker";
import { StarInput } from "@/components/molecules/star-input";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { toDateInputValue } from "@/lib/date/format-date";
import { fieldError, type RecordFieldErrors } from "@/lib/record/field-error";
import { cn } from "@/lib/style/cn";
import type { MovieSuggestion } from "@/schemas/movie/movie";
import { moodTagSchema, platformSchema } from "@/schemas/record/enums";
import type { RecordFormValues } from "@/schemas/record/record-form";

type RecordBasicsFieldsProps = {
  lang: Locale;
  values: RecordFormValues;
  posterUrl: string;
  posterVersion: number;
  title: string;
  titleNote: ReactNode;
  onTitleChange: (title: string) => void;
  searchMovies: (title: string) => Promise<MovieSuggestion[]>;
  onMovieSelect: (movieId: string) => void;
  uploadPoster: (formData: FormData) => Promise<ActionResult<string>>;
  errors?: RecordFieldErrors;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  closeLabel: string;
};

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toDateInputValue(date);
}

export function RecordBasicsFields({
  lang,
  values,
  posterUrl,
  posterVersion,
  title,
  titleNote,
  onTitleChange,
  searchMovies,
  onMovieSelect,
  uploadPoster,
  errors,
  dict,
  enums,
  closeLabel,
}: RecordBasicsFieldsProps) {
  const [watchedAt, setWatchedAt] = useState("");
  const [platform, setPlatform] = useState<string[]>(
    values.platform ? [values.platform] : [],
  );
  const [moods, setMoods] = useState<string[]>(values.moodTags);
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
  const error = (field: Parameters<typeof fieldError>[2]) =>
    fieldError(errors, dict, field);
  const required = { required: true, requiredLabel: dict.required };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 lg:gap-x-7">
        <div>
          <PosterPicker
            key={posterVersion}
            name="posterUrl"
            defaultValue={posterUrl}
            upload={uploadPoster}
            invalid={Boolean(error("posterUrl"))}
            dict={dict}
          />
          {error("posterUrl") && (
            <p
              role="alert"
              className="mt-1 w-23 text-[10px] text-destructive-foreground leading-4 lg:w-38 lg:text-[11px]"
            >
              {error("posterUrl")}
            </p>
          )}
        </div>
        <div className="contents lg:flex lg:min-w-0 lg:flex-col">
          <div className="min-w-0">
            <label
              htmlFor="title"
              className={cn(
                "block font-semibold text-[11px] leading-7 lg:text-xs",
                error("title")
                  ? "text-destructive-foreground"
                  : "text-paper-label",
              )}
            >
              {dict.title}
              <span aria-hidden className="text-destructive">
                {" "}
                *
              </span>
              <span className="sr-only">{dict.required}</span>
            </label>
            <MovieTitleField
              id="title"
              name="title"
              required
              maxLength={255}
              value={title}
              onValueChange={onTitleChange}
              search={searchMovies}
              onSelect={onMovieSelect}
              listLabel={dict.movieSuggestions}
              countTemplate={dict.suggestionCount}
              manualHint={dict.suggestionManual}
              placeholder={dict.titlePlaceholder}
              invalid={Boolean(error("title"))}
            />
            <p
              className={cn(
                "truncate text-[10px] leading-7 lg:text-[11px]",
                error("title")
                  ? "text-destructive-foreground"
                  : "text-paper-muted",
              )}
            >
              {error("title") ?? titleNote}
            </p>
          </div>
          <div className="col-span-2 mt-7 min-w-0 lg:col-span-1 lg:col-start-2 lg:mt-0">
            <NotebookField
              label={dict.watchedAt}
              htmlFor="watchedAt"
              error={error("watchedAt")}
              labelWidth="sm"
              {...required}
            >
              <div className="flex h-7 items-center gap-1.5">
                <DatePickerField
                  id="watchedAt"
                  name="watchedAt"
                  value={watchedAt}
                  onValueChange={setWatchedAt}
                  lang={lang}
                />
                {quickDates.map((quick) => (
                  <button
                    key={quick.label}
                    type="button"
                    onClick={() => setWatchedAt(quick.value)}
                    aria-pressed={watchedAt === quick.value}
                    className="h-6 whitespace-nowrap rounded-full px-2.5 text-[11px] text-paper-ink shadow-[inset_0_0_0_1px_rgb(10_41_71/0.2)] outline-none focus-visible:ring-2 focus-visible:ring-ring aria-pressed:bg-(--navy) aria-pressed:text-(--beige) aria-pressed:shadow-none lg:text-xs"
                  >
                    {quick.label}
                  </button>
                ))}
              </div>
            </NotebookField>
            <NotebookField
              label={dict.score}
              error={error("score")}
              labelWidth="sm"
              {...required}
            >
              <StarInput
                name="score"
                label={dict.score}
                starLabel={dict.scoreStar}
                defaultValue={values.score}
                invalid={Boolean(error("score"))}
              />
            </NotebookField>
          </div>
        </div>
      </div>
      <div className="mt-7 flex flex-col gap-7">
        <NotebookField
          label={dict.platform}
          error={error("platform")}
          labelWidth="sm"
          {...required}
        >
          <ChoicePicker
            name="platform"
            title={dict.platform}
            placeholder={dict.choose}
            options={platformSchema.options.map((value) => ({
              value,
              label: enums.platform[value],
            }))}
            value={platform}
            onChange={setPlatform}
            invalid={Boolean(error("platform"))}
            closeLabel={closeLabel}
          />
        </NotebookField>
        <NotebookField
          label={dict.moodTags}
          error={error("moodTags")}
          labelWidth="sm"
        >
          <ChoicePicker
            name="moodTags"
            title={dict.moodTags}
            placeholder={dict.chooseMany}
            options={moodTagSchema.options.map((value) => ({
              value,
              label: enums.moodTag[value],
            }))}
            value={moods}
            onChange={setMoods}
            multiple
            invalid={Boolean(error("moodTags"))}
            closeLabel={closeLabel}
          />
        </NotebookField>
      </div>
    </div>
  );
}
