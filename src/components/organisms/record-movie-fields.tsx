import type { ActionResult } from "@/actions/action-result";
import { ChoiceChip } from "@/components/atoms/choice-chip";
import { Input } from "@/components/atoms/input";
import { CountryInput } from "@/components/molecules/country-input";
import { CreditRows } from "@/components/molecules/credit-rows";
import { FormField } from "@/components/molecules/form-field";
import { PosterUrlField } from "@/components/molecules/poster-url-field";
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
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";
import { genreSchema } from "@/schemas/record/enums";
import type {
  RecordFormValues,
  SelectOption,
} from "@/schemas/record/record-form";

type RecordMovieFieldsProps = {
  lang: Locale;
  values: RecordFormValues;
  errors?: RecordFieldErrors;
  languageOptions: SelectOption[];
  maxReleaseYear: number;
  uploadPoster: (formData: FormData) => Promise<ActionResult<string>>;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  split?: boolean;
};

export function RecordMovieFields({
  lang,
  values,
  errors,
  languageOptions,
  maxReleaseYear,
  uploadPoster,
  dict,
  enums,
  split = false,
}: RecordMovieFieldsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4.5",
        split && "xl:grid xl:grid-cols-2 xl:items-start xl:gap-8",
      )}
    >
      <div className={split ? "flex flex-col gap-4.5" : "contents"}>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label={dict.releaseYear}
            error={fieldError(errors, dict, "releaseYear")}
            htmlFor="releaseYear"
            required
            requiredLabel={dict.required}
            hint={interpolate(dict.releaseYearHint, { max: maxReleaseYear })}
          >
            <Input
              id="releaseYear"
              name="releaseYear"
              type="number"
              inputMode="numeric"
              required
              min={1888}
              max={maxReleaseYear}
              defaultValue={values.releaseYear}
              className="tabular-nums"
            />
          </FormField>
          <FormField
            label={dict.runtime}
            error={fieldError(errors, dict, "runtime")}
            htmlFor="runtime"
            hint={dict.runtimeHint}
          >
            <div className="relative">
              <Input
                id="runtime"
                name="runtime"
                type="number"
                inputMode="numeric"
                min={0}
                max={1440}
                defaultValue={values.runtime}
                className="pr-10 tabular-nums"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground text-sm">
                {dict.runtimeUnit}
              </span>
            </div>
          </FormField>
        </div>

        <div
          className={cn("grid gap-4 sm:grid-cols-2", split && "xl:grid-cols-1")}
        >
          <FormField
            label={dict.language}
            error={fieldError(errors, dict, "language")}
            required
            requiredLabel={dict.required}
            hint={dict.languageHint}
          >
            <Select
              name="language"
              items={languageOptions}
              defaultValue={values.language}
            >
              <SelectTrigger aria-label={dict.language} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField
            label={dict.countries}
            error={fieldError(errors, dict, "countries")}
            htmlFor="countries"
          >
            <CountryInput
              id="countries"
              name="countries"
              lang={lang}
              defaultValue={values.countries}
              placeholder={dict.countriesPlaceholder}
              removeTemplate={dict.removeCountry}
            />
          </FormField>
        </div>
      </div>

      <div className={split ? "flex flex-col gap-4.5" : "contents"}>
        <FormField
          label={dict.genres}
          error={fieldError(errors, dict, "genres")}
          hint={dict.genresHint}
        >
          <div className="flex flex-wrap gap-1.75">
            {genreSchema.options.map((genre) => (
              <ChoiceChip
                key={genre}
                type="checkbox"
                name="genres"
                value={genre}
                shape="square"
                size="sm"
                tone="genre"
                className="text-[13px]"
                defaultChecked={values.genres.includes(genre)}
              >
                {enums.genre[genre]}
              </ChoiceChip>
            ))}
          </div>
        </FormField>

        <FormField
          label={dict.credits}
          error={fieldError(errors, dict, "credits")}
          hint={dict.creditsHint}
        >
          <CreditRows
            defaultValue={values.credits}
            roleLabels={enums.creditRole}
            roleLabel={dict.creditRole}
            namePlaceholder={dict.personName}
            addLabel={dict.addCredit}
            removeLabel={dict.removeCredit}
          />
        </FormField>

        <FormField
          label={dict.posterUrl}
          error={fieldError(errors, dict, "posterUrl")}
          htmlFor="posterUrl"
        >
          <PosterUrlField
            id="posterUrl"
            name="posterUrl"
            defaultValue={values.posterUrl}
            placeholder={dict.posterUrlPlaceholder}
            upload={uploadPoster}
            uploadLabel={dict.uploadPoster}
            uploadingLabel={dict.uploadingPoster}
            errorLabel={dict.posterUploadError}
          />
        </FormField>
      </div>
    </div>
  );
}
