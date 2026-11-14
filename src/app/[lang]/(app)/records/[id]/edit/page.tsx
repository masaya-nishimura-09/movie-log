import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { uploadPosterAction } from "@/actions/media/upload-poster";
import {
  getMovieAction,
  searchMoviesAction,
} from "@/actions/movie/movie-assist";
import {
  addAttachmentAction,
  deleteAttachmentAction,
} from "@/actions/record/attachment";
import { updateRecordAction } from "@/actions/record/save-record";
import { getRecord } from "@/api/record/get-record";
import { getRecordAttachments } from "@/api/record/get-record-attachments";
import { PageTopBar } from "@/components/organisms/page-top-bar";
import { RecordEditForm } from "@/components/organisms/record-edit-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { isRecordStep } from "@/lib/record/field-step";
import { maxReleaseYear, toFormValues } from "@/lib/record/to-form-values";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.recordForm.editTitle };
}

export default async function EditRecordPage({
  params,
  searchParams,
}: PageProps<"/[lang]/records/[id]/edit">) {
  const { id } = await params;
  const { tab } = await searchParams;
  const initialTab = isRecordStep(tab) ? tab : "basics";
  const [lang, dict, record, attachments] = await Promise.all([
    getLocale(),
    getDictionary(),
    getRecord(id),
    getRecordAttachments(id),
  ]);
  if (!record) notFound();
  const values = toFormValues(record);
  const backHref = `/${lang}/records/${id}`;

  return (
    <>
      <PageTopBar
        backHref={backHref}
        backLabel={dict.recordForm.back}
        title={dict.recordForm.editTitle}
      />
      <RecordEditForm
        initialTab={initialTab}
        lang={lang}
        action={updateRecordAction.bind(null, id)}
        attachments={attachments}
        addAttachment={addAttachmentAction.bind(null, id)}
        deleteAttachment={deleteAttachmentAction.bind(null, id)}
        searchMovies={searchMoviesAction.bind(null, lang)}
        getMovie={getMovieAction.bind(null, lang)}
        uploadPoster={uploadPosterAction}
        backHref={backHref}
        values={values}
        maxReleaseYear={maxReleaseYear(new Date())}
        dict={dict.recordForm}
        enums={dict.enums}
        counterTemplate={dict.characterCount}
        editorDict={dict.noteEditor}
      />
    </>
  );
}
