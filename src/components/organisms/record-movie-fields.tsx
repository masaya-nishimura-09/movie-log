"use client";

import { useState } from "react";
import { NotebookHeading } from "@/components/atoms/notebook-heading";
import { NotebookInput, notebookLine } from "@/components/atoms/notebook-input";
import { ChoicePicker } from "@/components/molecules/choice-picker";
import { CountryInput } from "@/components/molecules/country-input";
import { CreditRows } from "@/components/molecules/credit-rows";
import { NotebookField } from "@/components/molecules/notebook-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/molecules/select";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { fieldError, type RecordFieldErrors } from "@/lib/record/field-error";
import { buildLanguageOptions } from "@/lib/record/language-options";
import { cn } from "@/lib/style/cn";
import { paperPlaceholder } from "@/lib/style/paper";
import { genreSchema } from "@/schemas/record/enums";
import type { RecordFormValues } from "@/schemas/record/record-form";

type RecordMovieFieldsProps = {
  lang: Locale;
  values: RecordFormValues;
  errors?: RecordFieldErrors;
  maxReleaseYear: number;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  closeLabel: string;
};

export function RecordMovieFields({
  lang,
  values,
  errors,
  maxReleaseYear,
  dict,
  enums,
  closeLabel,
}: RecordMovieFieldsProps) {
  const [genres, setGenres] = useState<string[]>(values.genres);
  const languageOptions = buildLanguageOptions(
    lang,
    values.language,
    dict.languageUnknown,
  );
  const error = (field: Parameters<typeof fieldError>[2]) =>
    fieldError(errors, dict, field);
  const required = { required: true, requiredLabel: dict.required };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <NotebookHeading>{dict.movieInfo}</NotebookHeading>
        <p className="hidden text-paper-muted text-xs lg:block">
          {dict.movieInfoHint}
        </p>
      </div>
      <p className="text-paper-muted text-xs leading-7 lg:hidden">
        {dict.movieInfoHint}
      </p>
      <div className="flex flex-col lg:mt-7">
        <NotebookField
          label={dict.originalTitle}
          htmlFor="originalTitle"
          error={error("originalTitle")}
        >
          <NotebookInput
            id="originalTitle"
            name="originalTitle"
            maxLength={255}
            placeholder={dict.originalTitlePlaceholder}
            defaultValue={values.originalTitle}
            aria-invalid={Boolean(error("originalTitle")) || undefined}
          />
        </NotebookField>
        <NotebookField
          label={dict.releaseYear}
          htmlFor="releaseYear"
          error={error("releaseYear")}
          {...required}
        >
          <NotebookInput
            id="releaseYear"
            name="releaseYear"
            type="number"
            inputMode="numeric"
            required
            min={1888}
            max={maxReleaseYear}
            placeholder={dict.releaseYearPlaceholder}
            defaultValue={values.releaseYear}
            aria-invalid={Boolean(error("releaseYear")) || undefined}
            className="tabular-nums"
          />
        </NotebookField>
        <NotebookField
          label={dict.runtime}
          htmlFor="runtime"
          error={error("runtime")}
        >
          <div className="relative">
            <NotebookInput
              id="runtime"
              name="runtime"
              type="number"
              inputMode="numeric"
              min={0}
              max={1440}
              placeholder={dict.runtimePlaceholder}
              defaultValue={values.runtime || ""}
              aria-invalid={Boolean(error("runtime")) || undefined}
              className="pr-8 tabular-nums"
            />
            <span className="pointer-events-none absolute inset-y-0 right-1 flex items-center text-paper-muted text-xs">
              {dict.runtimeUnit}
            </span>
          </div>
        </NotebookField>
        <NotebookField
          label={dict.countries}
          htmlFor="countries"
          error={error("countries")}
        >
          <CountryInput
            id="countries"
            name="countries"
            lang={lang}
            defaultValue={values.countries}
            placeholder={dict.countriesPlaceholder}
            addLabel={dict.addCountry}
            notFoundLabel={dict.countryNotFound}
            removeTemplate={dict.removeCountry}
            invalid={Boolean(error("countries"))}
          />
        </NotebookField>
        <NotebookField
          label={dict.language}
          error={error("language")}
          {...required}
        >
          <Select
            name="language"
            items={languageOptions}
            defaultValue={values.language || null}
          >
            <SelectTrigger
              aria-label={dict.language}
              size="sm"
              data-field="language"
              aria-invalid={Boolean(error("language")) || undefined}
              className={cn(
                "h-7 w-full rounded-none bg-transparent px-0.5 font-normal text-[13px] text-paper-ink data-[size=sm]:h-7 data-[size=sm]:rounded-none data-placeholder:text-[#a8a397] lg:text-sm",
                notebookLine,
              )}
            >
              <SelectValue placeholder={dict.choose} />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </NotebookField>
        <NotebookField label={dict.genres} error={error("genres")}>
          <ChoicePicker
            name="genres"
            title={dict.genres}
            placeholder={dict.chooseMany}
            options={genreSchema.options.map((value) => ({
              value,
              label: enums.genre[value],
            }))}
            value={genres}
            onChange={setGenres}
            multiple
            invalid={Boolean(error("genres"))}
            closeLabel={closeLabel}
          />
        </NotebookField>
        <NotebookField label={dict.credits} error={error("credits")}>
          <CreditRows
            defaultValue={values.credits}
            roleLabels={enums.creditRole}
            invalid={Boolean(error("credits"))}
            dict={{ ...dict, close: closeLabel }}
          />
        </NotebookField>
      </div>
      <div className="mt-7">
        <NotebookHeading>
          <label htmlFor="overview">{dict.overview}</label>
        </NotebookHeading>
        <textarea
          id="overview"
          name="overview"
          maxLength={2000}
          rows={3}
          placeholder={dict.overviewPlaceholder}
          defaultValue={values.overview}
          aria-invalid={Boolean(error("overview")) || undefined}
          className={cn(
            "block w-full resize-none bg-transparent px-0.5 text-[13px] text-paper-ink leading-7 outline-none [field-sizing:content] aria-invalid:ring-1 aria-invalid:ring-destructive lg:text-sm",
            paperPlaceholder,
          )}
        />
        {error("overview") && (
          <p
            role="alert"
            className="text-destructive-foreground text-xs leading-7"
          >
            {error("overview")}
          </p>
        )}
      </div>
    </div>
  );
}
