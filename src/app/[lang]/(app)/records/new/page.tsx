import type { Metadata } from "next";
import { uploadPosterAction } from "@/actions/media/upload-poster";
import {
  getMovieAction,
  searchMoviesAction,
} from "@/actions/movie/movie-assist";
import {
  addAttachmentAction,
  deleteAttachmentAction,
} from "@/actions/record/attachment";
import { createRecordAction } from "@/actions/record/save-record";
import { RecordForm } from "@/components/organisms/record-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { emptyFormValues, maxReleaseYear } from "@/lib/record/to-form-values";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.recordForm.createTitle };
}

export default async function NewRecordPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  const listHref = `/${lang}/records`;

  return (
    <>
      <h1 className="sr-only">{dict.recordForm.createTitle}</h1>
      <RecordForm
        mode="create"
        lang={lang}
        action={createRecordAction}
        attachments={[]}
        addAttachment={addAttachmentAction}
        deleteAttachment={deleteAttachmentAction}
        searchMovies={searchMoviesAction.bind(null, lang)}
        getMovie={getMovieAction.bind(null, lang)}
        uploadPoster={uploadPosterAction}
        values={emptyFormValues()}
        maxReleaseYear={maxReleaseYear(new Date())}
        backHref={listHref}
        backLabel={dict.recordDetail.back}
        cancelHref={listHref}
        closeLabel={dict.header.close}
        dict={dict.recordForm}
        enums={dict.enums}
        editorDict={dict.noteEditor}
      />
    </>
  );
}
