import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { uploadPosterAction } from "@/actions/media/upload-poster";
import {
  getMovieAction,
  searchMoviesAction,
} from "@/actions/movie/movie-assist";
import { updateRecordAction } from "@/actions/record/save-record";
import { getRecord } from "@/api/record/get-record";
import { PageTopBar } from "@/components/organisms/page-top-bar";
import { RecordEditForm } from "@/components/organisms/record-edit-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { buildLanguageOptions } from "@/lib/record/language-options";
import { maxReleaseYear, toFormValues } from "@/lib/record/to-form-values";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.recordForm.editTitle };
}

export default async function EditRecordPage({
  params,
}: PageProps<"/[lang]/records/[id]/edit">) {
  const { id } = await params;
  const [lang, dict, record] = await Promise.all([
    getLocale(),
    getDictionary(),
    getRecord(id),
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
        lang={lang}
        action={updateRecordAction.bind(null, lang, id)}
        searchMovies={searchMoviesAction.bind(null, lang)}
        getMovie={getMovieAction.bind(null, lang)}
        uploadPoster={uploadPosterAction}
        backHref={backHref}
        values={values}
        languageOptions={buildLanguageOptions(
          lang,
          values.language,
          dict.recordForm.languageUnknown,
        )}
        maxReleaseYear={maxReleaseYear(new Date())}
        dict={dict.recordForm}
        enums={dict.enums}
        counterTemplate={dict.characterCount}
      />
    </>
  );
}
