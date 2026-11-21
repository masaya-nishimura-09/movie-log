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
import { LocalDate } from "@/components/atoms/local-date";
import { RecordForm } from "@/components/organisms/record-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { maxReleaseYear, toFormValues } from "@/lib/record/to-form-values";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.recordForm.editTitle };
}

export default async function EditRecordPage({
  params,
}: PageProps<"/[lang]/records/[id]/edit">) {
  const { id } = await params;
  const [lang, dict, record, attachments] = await Promise.all([
    getLocale(),
    getDictionary(),
    getRecord(id),
    getRecordAttachments(id),
  ]);
  if (!record) notFound();
  const recordHref = `/${lang}/records/${id}`;
  const f = dict.recordForm;

  return (
    <>
      <h1 className="sr-only">{f.editTitle}</h1>
      <RecordForm
        mode="edit"
        lang={lang}
        action={updateRecordAction.bind(null, id)}
        attachments={attachments}
        addAttachment={addAttachmentAction}
        deleteAttachment={deleteAttachmentAction}
        searchMovies={searchMoviesAction.bind(null, lang)}
        getMovie={getMovieAction.bind(null, lang)}
        uploadPoster={uploadPosterAction}
        values={toFormValues(record)}
        titleNote={
          <>
            {f.recordedLabel}{" "}
            <LocalDate
              date={record.createdAt}
              locale={lang}
              dateStyle="medium"
            />
            {" ・ "}
            {f.updatedLabel}{" "}
            <LocalDate
              date={record.updatedAt}
              locale={lang}
              dateStyle="short"
            />
          </>
        }
        maxReleaseYear={maxReleaseYear(new Date())}
        backHref={recordHref}
        backLabel={f.backToRecord}
        cancelHref={recordHref}
        closeLabel={dict.header.close}
        dict={f}
        enums={dict.enums}
        editorDict={dict.noteEditor}
      />
    </>
  );
}
