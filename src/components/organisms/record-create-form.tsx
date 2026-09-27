"use client";

import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { RecordBasicsFields } from "@/components/organisms/record-basics-fields";
import { RecordImpressionFields } from "@/components/organisms/record-impression-fields";
import { RecordMovieFields } from "@/components/organisms/record-movie-fields";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";
import type { Platform } from "@/schemas/record/enums";
import type {
  RecordFormValues,
  SelectOption,
} from "@/schemas/record/record-form";

type RecordCreateFormProps = {
  lang: Locale;
  values: RecordFormValues;
  frequentPlatforms: Platform[];
  languageOptions: SelectOption[];
  maxReleaseYear: number;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  counterTemplate: string;
};

export function RecordCreateForm({
  lang,
  values,
  frequentPlatforms,
  languageOptions,
  maxReleaseYear,
  dict,
  enums,
  counterTemplate,
}: RecordCreateFormProps) {
  const [step, setStep] = useState(0);
  const steps = [dict.stepBasics, dict.stepMovieInfo, dict.stepImpression];

  return (
    <form className="flex min-h-dvh flex-col bg-card md:mx-auto md:my-10 md:min-h-0 md:w-160 md:overflow-hidden md:rounded-[18px] md:border">
      <header className="sticky top-0 z-10 flex flex-col gap-3.5 border-b bg-card px-4.5 pt-4 pb-3.5 md:static md:border-none md:px-6.5 md:pt-5.5 md:pb-0">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-[19px] text-foreground">
            {dict.createTitle}
          </h1>
          <Link
            href={`/${lang}/records`}
            aria-label={dict.close}
            className="-mr-1 rounded-sm p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="size-5.25" aria-hidden />
          </Link>
        </div>
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

      <div className="flex-1 px-4.5 py-5.5 md:px-6.5 md:pb-2">
        <div hidden={step !== 0}>
          <RecordBasicsFields
            values={values}
            frequentPlatforms={frequentPlatforms}
            dict={dict}
            enums={enums}
            counterTemplate={counterTemplate}
          />
        </div>
        <div hidden={step !== 1} className="flex flex-col gap-4.5">
          <div className="flex items-baseline gap-2">
            <h2 className="font-bold text-base text-foreground">
              {dict.stepMovieInfo}
            </h2>
            <span className="text-muted-foreground text-xs">
              {dict.movieInfoHint}
            </span>
          </div>
          <RecordMovieFields
            lang={lang}
            values={values}
            languageOptions={languageOptions}
            maxReleaseYear={maxReleaseYear}
            dict={dict}
            enums={enums}
          />
        </div>
        <div hidden={step !== 2} className="flex flex-col gap-4.5">
          <div className="flex items-baseline gap-2">
            <h2 className="font-bold text-base text-foreground">
              {dict.impressionHeading}
            </h2>
            <span className="text-muted-foreground text-xs">
              {dict.optional}
            </span>
          </div>
          <RecordImpressionFields
            values={values}
            dict={dict}
            enums={enums}
            counterTemplate={counterTemplate}
          />
        </div>
      </div>

      <footer className="sticky bottom-0 flex items-center gap-2 border-t bg-card px-4.5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:static md:mx-6.5 md:mb-6.5 md:border-secondary md:px-0 md:pt-2 md:pb-0">
        {step === 0 && (
          <>
            <span className="mr-auto hidden text-[12.5px] text-foreground-sub md:inline">
              {dict.canSaveHere}
            </span>
            <Button type="button" variant="outline" className="md:px-4">
              <span className="md:hidden">{dict.saveShort}</span>
              <span className="hidden md:inline">{dict.saveAndFinish}</span>
            </Button>
            <Button
              type="button"
              onClick={() => setStep(1)}
              className="h-12 flex-1 md:h-11 md:flex-none md:px-4.5"
            >
              {dict.next}
              <ArrowRight className="size-4.5" aria-hidden />
            </Button>
          </>
        )}
        {step === 1 && (
          <>
            <Button type="button" variant="ghost" onClick={() => setStep(0)}>
              <ArrowLeft className="size-4.5" aria-hidden />
              {dict.back}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep(2)}
              className="ml-auto"
            >
              {dict.skip}
            </Button>
            <Button
              type="button"
              onClick={() => setStep(2)}
              className="h-12 md:h-11 md:px-4.5"
            >
              {dict.next}
              <ArrowRight className="size-4.5" aria-hidden />
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <Button type="button" variant="ghost" onClick={() => setStep(1)}>
              <ArrowLeft className="size-4.5" aria-hidden />
              {dict.back}
            </Button>
            <Button
              type="button"
              className="ml-auto h-12 flex-1 md:h-11 md:flex-none md:px-4.5"
            >
              {dict.save}
            </Button>
          </>
        )}
      </footer>
    </form>
  );
}
