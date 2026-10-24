import type { Metadata } from "next";
import { uploadPosterAction } from "@/actions/media/upload-poster";
import {
  getMovieAction,
  searchMoviesAction,
} from "@/actions/movie/movie-assist";
import { createRecordAction } from "@/actions/record/save-record";
import { RecordCreateForm } from "@/components/organisms/record-create-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { emptyFormValues, maxReleaseYear } from "@/lib/record/to-form-values";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.recordForm.createTitle };
}

export default async function NewRecordPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  const today = new Date();
  const values = emptyFormValues();

  return (
    <>
      <h1 className="px-4 pt-5 font-bold text-2xl text-foreground md:px-7 md:pt-6">
        {dict.recordForm.createTitle}
      </h1>
      <RecordCreateForm
        lang={lang}
        action={createRecordAction.bind(null, lang)}
        searchMovies={searchMoviesAction.bind(null, lang)}
        getMovie={getMovieAction.bind(null, lang)}
        uploadPoster={uploadPosterAction}
        values={values}
        maxReleaseYear={maxReleaseYear(today)}
        dict={dict.recordForm}
        enums={dict.enums}
        counterTemplate={dict.characterCount}
      />
    </>
  );
}
