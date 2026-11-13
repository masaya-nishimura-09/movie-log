"use client";

import { Toast } from "@base-ui/react/toast";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { z } from "zod";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import { FormAlert } from "@/components/atoms/form-alert";
import { FormField } from "@/components/molecules/form-field";
import { PendingAttachmentsField } from "@/components/molecules/pending-attachments-field";
import { RecordBasicsFields } from "@/components/organisms/record-basics-fields";
import { RecordImpressionFields } from "@/components/organisms/record-impression-fields";
import { RecordMovieFields } from "@/components/organisms/record-movie-fields";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { useMovieAssist } from "@/hooks/use-movie-assist";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import type { RecordFieldErrors } from "@/lib/record/field-error";
import { readRecordForm } from "@/lib/record/read-record-form";
import { convertWatchedAt } from "@/lib/record/watched-at";
import { cn } from "@/lib/style/cn";
import { dictMessage } from "@/lib/text/dict-message";
import { interpolate } from "@/lib/text/interpolate";
import type { MovieSuggestion, MovieValues } from "@/schemas/movie/movie";
import type { RecordFormValues } from "@/schemas/record/record-form";
import { recordInputSchema } from "@/schemas/record/record-input";

type RecordCreateFormProps = {
  lang: Locale;
  action: (
    previous: ActionResult<string> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<string>>;
  addAttachment: (
    recordId: string,
    formData: FormData,
  ) => Promise<ActionResult<null>>;
  searchMovies: (title: string) => Promise<MovieSuggestion[]>;
  getMovie: (movieId: string) => Promise<MovieValues | undefined>;
  uploadPoster: (formData: FormData) => Promise<ActionResult<string>>;
  values: RecordFormValues;
  maxReleaseYear: number;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  counterTemplate: string;
  editorDict: Dictionary["noteEditor"];
};

const fieldSteps: Record<string, number> = {
  title: 0,
  watchedAt: 0,
  score: 0,
  platform: 0,
  originalTitle: 1,
  overview: 1,
  releaseYear: 1,
  runtime: 1,
  language: 1,
  countries: 1,
  genres: 1,
  credits: 1,
  posterUrl: 1,
  moodTags: 2,
  note: 2,
};

export function RecordCreateForm({
  lang,
  action,
  addAttachment,
  searchMovies,
  getMovie,
  uploadPoster,
  values,
  maxReleaseYear,
  dict,
  enums,
  counterTemplate,
  editorDict,
}: RecordCreateFormProps) {
  const [step, setStep] = useState(0);
  const steps = [dict.stepBasics, dict.stepMovieInfo, dict.stepImpression];
  const { state, failure, pending, submit } = useFormSubmit(
    action,
    convertWatchedAt,
  );
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const toastManager = Toast.useToastManager();
  const savedId = state?.success ? state.data : undefined;
  const pendingFiles = useRef(files);
  pendingFiles.current = files;
  const afterSave = useRef({ router, toastManager, addAttachment });
  afterSave.current = { router, toastManager, addAttachment };

  useEffect(() => {
    if (savedId === undefined) return;
    const { router, toastManager, addAttachment } = afterSave.current;
    setUploading(true);
    (async () => {
      let ok = true;
      for (const file of pendingFiles.current) {
        const formData = new FormData();
        formData.set("file", file);
        const result = await addAttachment(savedId, formData);
        if (!result.success) ok = false;
      }
      if (!ok) toastManager.add({ title: dict.attachmentsUploadFailed });
      router.push(`/${lang}/records/${savedId}`);
    })();
  }, [savedId, lang, dict.attachmentsUploadFailed]);
  const movie = useMovieAssist(values, getMovie);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stepErrors, setStepErrors] = useState<RecordFieldErrors>();
  const errors = stepErrors ?? failure?.errors;

  useEffect(() => {
    const fields = Object.keys(failure?.errors ?? {});
    const steps = fields.map((field) => fieldSteps[field] ?? 0);
    if (steps.length > 0) setStep(Math.min(...steps));
  }, [failure]);

  const goNext = (event: MouseEvent<HTMLButtonElement>) => {
    const form = event.currentTarget.form;
    if (!form) return;
    const formData = new FormData(form);
    convertWatchedAt(formData);
    const result = recordInputSchema.safeParse(readRecordForm(formData));
    const invalid: RecordFieldErrors = Object.fromEntries(
      Object.entries(
        result.success ? {} : z.flattenError(result.error).fieldErrors,
      ).filter(([field]) => fieldSteps[field] === step),
    );
    const invalidFields = Object.keys(invalid);
    if (invalidFields.length > 0) {
      setStepErrors(invalid);
      stepRefs.current[step]
        ?.querySelector<HTMLElement>(
          invalidFields.map((field) => `[name="${field}"]`).join(", "),
        )
        ?.focus();
      return;
    }
    setStepErrors(undefined);
    setStep(step + 1);
  };

  return (
    <form
      onSubmit={(event) => {
        setStepErrors(undefined);
        submit(event);
      }}
      noValidate
      className="flex w-full flex-1 flex-col"
    >
      <header className="flex flex-col gap-3.5 bg-background px-4 pt-4 pb-3.5 md:px-7 md:pt-5 md:pb-0">
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

      <div className="flex-1 px-4 py-5.5 md:flex-none md:px-7 md:pb-2">
        <div className="rounded-[18px] bg-card p-4.5 md:p-5.5">
          {failure && (
            <FormAlert className="mb-4.5">
              {dictMessage(dict, failure.messageKey) ?? dict.unexpectedError}
            </FormAlert>
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
              errors={errors}
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
            <h2 className="font-bold text-base text-foreground">
              {dict.stepMovieInfo}
            </h2>
            <RecordMovieFields
              split
              errors={errors}
              key={movie.version}
              lang={lang}
              values={movie.values}
              maxReleaseYear={maxReleaseYear}
              uploadPoster={uploadPoster}
              counterTemplate={counterTemplate}
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
              errors={errors}
              values={values}
              dict={dict}
              enums={enums}
              editorDict={editorDict}
            />
            <FormField label={dict.attachments} hint={dict.attachmentsHint}>
              <PendingAttachmentsField
                files={files}
                onChange={setFiles}
                dict={dict}
              />
            </FormField>
          </div>
        </div>
      </div>

      <footer className="flex items-center gap-2 px-4 pt-3 pb-4 md:mx-7 md:mb-8 md:px-0 md:pt-2 md:pb-0">
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
            disabled={pending || savedId !== undefined}
            className="ml-auto h-12 flex-1 md:h-11 md:flex-none md:px-4.5"
          >
            {uploading ? dict.uploadingAttachments : dict.save}
          </Button>
        )}
      </footer>
    </form>
  );
}
