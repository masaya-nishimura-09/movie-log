"use client";

import { Toast } from "@base-ui/react/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import type { ActionResult } from "@/actions/action-result";
import { Button, buttonVariants } from "@/components/atoms/button";
import { FormAlert } from "@/components/atoms/form-alert";
import { FormField } from "@/components/molecules/form-field";
import { PendingAttachmentsField } from "@/components/molecules/pending-attachments-field";
import { RecordTabs } from "@/components/molecules/record-tabs";
import { RecordBasicsFields } from "@/components/organisms/record-basics-fields";
import { RecordImpressionFields } from "@/components/organisms/record-impression-fields";
import { RecordMovieFields } from "@/components/organisms/record-movie-fields";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { useMovieAssist } from "@/hooks/use-movie-assist";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import {
  errorSteps,
  type RecordStep,
  recordFieldSteps,
  recordSteps,
} from "@/lib/record/field-step";
import { convertWatchedAt } from "@/lib/record/watched-at";
import { dictMessage } from "@/lib/text/dict-message";
import type { MovieSuggestion, MovieValues } from "@/schemas/movie/movie";
import type { Attachment } from "@/schemas/record/attachment";
import type { RecordFormValues } from "@/schemas/record/record-form";

type RecordEditFormProps = {
  initialTab: RecordStep;
  lang: Locale;
  action: (
    previous: ActionResult<string> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<string>>;
  attachments: Attachment[];
  addAttachment: (formData: FormData) => Promise<ActionResult<null>>;
  deleteAttachment: (attachmentId: string) => Promise<ActionResult<null>>;
  searchMovies: (title: string) => Promise<MovieSuggestion[]>;
  getMovie: (movieId: string) => Promise<MovieValues | undefined>;
  uploadPoster: (formData: FormData) => Promise<ActionResult<string>>;
  backHref: string;
  values: RecordFormValues;
  maxReleaseYear: number;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  counterTemplate: string;
  editorDict: Dictionary["noteEditor"];
};

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4.5 rounded-[18px] bg-card p-4.5 md:p-5.5">
      {children}
    </div>
  );
}

export function RecordEditForm({
  initialTab,
  lang,
  action,
  attachments,
  addAttachment,
  deleteAttachment,
  searchMovies,
  getMovie,
  uploadPoster,
  backHref,
  values,
  maxReleaseYear,
  dict,
  enums,
  counterTemplate,
  editorDict,
}: RecordEditFormProps) {
  const { state, failure, pending, submit } = useFormSubmit(
    action,
    convertWatchedAt,
  );
  const movie = useMovieAssist(values, getMovie);
  const [kept, setKept] = useState(attachments);
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();
  const toastManager = Toast.useToastManager();
  const saved = state?.success === true;
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
    if (!saved) return;
    const { router, toastManager, addAttachment, deleteAttachment } =
      afterSave.current;
    const { attachments, kept, files } = changes.current;
    (async () => {
      let ok = true;
      for (const attachment of attachments) {
        if (kept.some((a) => a.attachmentId === attachment.attachmentId)) {
          continue;
        }
        const result = await deleteAttachment(attachment.attachmentId);
        if (!result.success) ok = false;
      }
      for (const file of files) {
        const formData = new FormData();
        formData.set("file", file);
        const result = await addAttachment(formData);
        if (!result.success) ok = false;
      }
      if (!ok) toastManager.add({ title: dict.attachmentsUploadFailed });
      router.push(backHref);
    })();
  }, [saved, backHref, dict.attachmentsUploadFailed]);

  const [tab, setTab] = useState<string>(initialTab);
  const invalidSteps = useMemo(() => errorSteps(failure?.errors), [failure]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const [first] = invalidSteps;
    if (first === undefined) return;
    const step = recordSteps[first];
    if (step === undefined) return;
    setTab(step);
    const fields = Object.keys(failure?.errors ?? {}).filter(
      (field) => (recordFieldSteps[field] ?? 0) === first,
    );
    requestAnimationFrame(() => {
      formRef.current
        ?.querySelector<HTMLElement>(
          fields
            .flatMap((field) => [
              `[name="${field}"]:not([type=hidden])`,
              `[name^="${field}."]:not([type=hidden])`,
            ])
            .join(", "),
        )
        ?.focus();
    });
  }, [failure, invalidSteps]);

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      noValidate
      className="flex w-full flex-col gap-4 px-4 pt-5 md:px-10 md:pt-8"
    >
      {failure && (
        <FormAlert>
          {dictMessage(dict, failure.messageKey) ?? dict.unexpectedError}
        </FormAlert>
      )}
      <RecordTabs
        value={tab}
        onValueChange={setTab}
        keepMounted
        invalidLabel={dict.tabHasError}
        tabs={[
          {
            value: recordSteps[0],
            label: dict.stepBasics,
            invalid: invalidSteps.includes(0),
            content: (
              <Panel>
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
            ),
          },
          {
            value: recordSteps[1],
            label: dict.stepMovieInfo,
            invalid: invalidSteps.includes(1),
            content: (
              <Panel>
                <RecordMovieFields
                  errors={failure?.errors}
                  key={movie.version}
                  lang={lang}
                  values={movie.values}
                  maxReleaseYear={maxReleaseYear}
                  uploadPoster={uploadPoster}
                  counterTemplate={counterTemplate}
                  dict={dict}
                  enums={enums}
                />
              </Panel>
            ),
          },
          {
            value: recordSteps[2],
            label: dict.stepImpression,
            invalid: invalidSteps.includes(2),
            content: (
              <Panel>
                <RecordImpressionFields
                  errors={failure?.errors}
                  values={values}
                  dict={dict}
                  enums={enums}
                  editorDict={editorDict}
                />
                <FormField label={dict.attachments} hint={dict.attachmentsHint}>
                  <PendingAttachmentsField
                    files={files}
                    onChange={setFiles}
                    existing={kept}
                    onExistingChange={setKept}
                    dict={dict}
                  />
                </FormField>
              </Panel>
            ),
          },
        ]}
      />

      <div className="mb-6 flex justify-end gap-2">
        <Link
          href={backHref}
          className={buttonVariants({ variant: "outline" })}
        >
          {dict.cancel}
        </Link>
        <Button
          type="submit"
          pending={pending || saved}
          pendingLabel={dict.saving}
        >
          {dict.saveChanges}
        </Button>
      </div>
    </form>
  );
}
