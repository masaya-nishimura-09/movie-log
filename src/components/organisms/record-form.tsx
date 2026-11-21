"use client";

import { Toast } from "@base-ui/react/toast";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { z } from "zod";
import type { ActionResult } from "@/actions/action-result";
import { NotebookHeading } from "@/components/atoms/notebook-heading";
import { NoteEditor } from "@/components/molecules/note-editor";
import { PendingAttachmentsField } from "@/components/molecules/pending-attachments-field";
import { RecordBasicsFields } from "@/components/organisms/record-basics-fields";
import { RecordFormNotebook } from "@/components/organisms/record-form-notebook";
import { RecordMovieFields } from "@/components/organisms/record-movie-fields";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { useMovieAssist } from "@/hooks/use-movie-assist";
import { wideQuery } from "@/hooks/use-wide-screen";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import type { RecordFieldErrors } from "@/lib/record/field-error";
import { errorPages, fieldPage, spreadOf } from "@/lib/record/field-page";
import { readRecordForm } from "@/lib/record/read-record-form";
import { convertWatchedAt } from "@/lib/record/watched-at";
import { dictMessage } from "@/lib/text/dict-message";
import { interpolate } from "@/lib/text/interpolate";
import type { MovieSuggestion, MovieValues } from "@/schemas/movie/movie";
import { type Attachment, maxAttachments } from "@/schemas/record/attachment";
import type { RecordFormValues } from "@/schemas/record/record-form";
import { recordInputSchema } from "@/schemas/record/record-input";

type RecordFormProps = {
  mode: "create" | "edit";
  lang: Locale;
  action: (
    previous: ActionResult<string> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<string>>;
  attachments: Attachment[];
  addAttachment: (
    recordId: string,
    formData: FormData,
  ) => Promise<ActionResult<null>>;
  deleteAttachment: (
    recordId: string,
    attachmentId: string,
  ) => Promise<ActionResult<null>>;
  searchMovies: (title: string) => Promise<MovieSuggestion[]>;
  getMovie: (movieId: string) => Promise<MovieValues | undefined>;
  uploadPoster: (formData: FormData) => Promise<ActionResult<string>>;
  values: RecordFormValues;
  titleNote?: ReactNode;
  maxReleaseYear: number;
  backHref: string;
  backLabel: string;
  cancelHref: string;
  closeLabel: string;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  editorDict: Dictionary["noteEditor"];
};

function focusField(form: HTMLFormElement | null, fields: string[]) {
  form
    ?.querySelector<HTMLElement>(
      fields
        .flatMap((field) => [
          `[name="${field}"]:not([type=hidden])`,
          `[name^="${field}."]:not([type=hidden])`,
          `[data-field="${field}"]`,
        ])
        .join(", "),
    )
    ?.focus();
}

function isWide() {
  return window.matchMedia(wideQuery).matches;
}

export function RecordForm({
  mode,
  lang,
  action,
  attachments,
  addAttachment,
  deleteAttachment,
  searchMovies,
  getMovie,
  uploadPoster,
  values,
  titleNote,
  maxReleaseYear,
  backHref,
  backLabel,
  cancelHref,
  closeLabel,
  dict,
  enums,
  editorDict,
}: RecordFormProps) {
  const { state, failure, pending, submit } = useFormSubmit(
    action,
    convertWatchedAt,
  );
  const movie = useMovieAssist(values, getMovie);
  const [picked, setPicked] = useState(false);
  const [page, setPage] = useState(0);
  const [kept, setKept] = useState(attachments);
  const [files, setFiles] = useState<File[]>([]);
  const [stepErrors, setStepErrors] = useState<RecordFieldErrors>();
  const errors = stepErrors ?? failure?.errors;
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const toastManager = Toast.useToastManager();
  const savedId = state?.success ? state.data : undefined;
  const changes = useRef({ attachments, kept, files });
  changes.current = { attachments, kept, files };
  const afterSave = useRef({
    router,
    toastManager,
    addAttachment,
    deleteAttachment,
  });
  afterSave.current = { router, toastManager, addAttachment, deleteAttachment };

  useEffect(() => {
    if (savedId === undefined) return;
    const { router, toastManager, addAttachment, deleteAttachment } =
      afterSave.current;
    const { attachments, kept, files } = changes.current;
    (async () => {
      let ok = true;
      for (const attachment of attachments) {
        if (kept.some((a) => a.attachmentId === attachment.attachmentId)) {
          continue;
        }
        const result = await deleteAttachment(savedId, attachment.attachmentId);
        if (!result.success) ok = false;
      }
      for (const file of files) {
        const formData = new FormData();
        formData.set("file", file);
        const result = await addAttachment(savedId, formData);
        if (!result.success) ok = false;
      }
      if (!ok) toastManager.add({ title: dict.attachmentsUploadFailed });
      router.push(`/${lang}/records/${savedId}`);
    })();
  }, [savedId, lang, dict.attachmentsUploadFailed]);

  useEffect(() => {
    setStepErrors(undefined);
    const [first] = errorPages(failure?.errors);
    if (first === undefined) return;
    setPage(first);
    const fields = Object.keys(failure?.errors ?? {}).filter(
      (field) => fieldPage(field) === first,
    );
    requestAnimationFrame(() => focusField(formRef.current, fields));
  }, [failure]);

  const visiblePages = (current: number) =>
    isWide() ? [spreadOf(current) * 2, spreadOf(current) * 2 + 1] : [current];

  const goNext = () => {
    const form = formRef.current;
    if (!form) return;
    const formData = new FormData(form);
    convertWatchedAt(formData);
    const result = recordInputSchema.safeParse(readRecordForm(formData));
    const pages = visiblePages(page);
    const invalid: RecordFieldErrors = Object.fromEntries(
      Object.entries(
        result.success ? {} : z.flattenError(result.error).fieldErrors,
      ).filter(([field]) => pages.includes(fieldPage(field))),
    );
    const invalidFields = Object.keys(invalid);
    if (invalidFields.length > 0) {
      setStepErrors(invalid);
      focusField(form, invalidFields);
      return;
    }
    setStepErrors({});
    setPage(isWide() ? (spreadOf(page) + 1) * 2 : page + 1);
  };

  const goBack = () => {
    setStepErrors({});
    setPage(isWide() ? (spreadOf(page) - 1) * 2 : page - 1);
  };

  const alert =
    failure && !failure.errors
      ? (dictMessage(dict, failure.messageKey) ?? dict.unexpectedError)
      : undefined;
  const missingCount = Object.keys(errors ?? {}).length;
  const scrapTotal = kept.length + files.length;

  return (
    <form
      ref={formRef}
      data-record-form=""
      onSubmit={(event) => {
        setStepErrors(undefined);
        submit(event);
      }}
      noValidate
      className="flex flex-1 flex-col"
    >
      <RecordFormNotebook
        mode={mode}
        page={page}
        onBack={goBack}
        onNext={goNext}
        missingCount={missingCount}
        alert={alert}
        backHref={backHref}
        backLabel={backLabel}
        cancelHref={cancelHref}
        saving={pending || savedId !== undefined}
        dict={dict}
        panels={[
          <RecordBasicsFields
            key="basics"
            lang={lang}
            values={values}
            posterUrl={movie.values.posterUrl}
            posterVersion={movie.version}
            title={movie.title}
            titleNote={
              picked ? dict.titleSelected : (titleNote ?? dict.titleHint)
            }
            onTitleChange={movie.setTitle}
            searchMovies={searchMovies}
            onMovieSelect={(movieId) => {
              setPicked(true);
              movie.select(movieId);
            }}
            uploadPoster={uploadPoster}
            errors={errors}
            dict={dict}
            enums={enums}
            closeLabel={closeLabel}
          />,
          <RecordMovieFields
            key={`movie-${movie.version}`}
            lang={lang}
            values={movie.values}
            errors={errors}
            maxReleaseYear={maxReleaseYear}
            dict={dict}
            enums={enums}
            closeLabel={closeLabel}
          />,
          <NoteEditor
            key="note"
            id="note"
            name="note"
            defaultValue={values.note}
            dict={editorDict}
            invalid={Boolean(errors?.note)}
            heading={<NotebookHeading>{dict.note}</NotebookHeading>}
            error={errors?.note ? dict.errors.note : undefined}
          />,
          <div key="scrap" className="flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-x-3">
              <NotebookHeading>{dict.scrap}</NotebookHeading>
              <p className="text-[10px] text-paper-muted leading-7 lg:text-[11px]">
                {interpolate(dict.scrapCount, {
                  count: scrapTotal,
                  max: maxAttachments,
                })}
              </p>
            </div>
            <div className="mt-1.5">
              <PendingAttachmentsField
                files={files}
                onChange={setFiles}
                existing={kept}
                onExistingChange={setKept}
                dict={dict}
              />
            </div>
          </div>,
        ]}
      />
    </form>
  );
}
