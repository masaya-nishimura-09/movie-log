import { uploadPosterAction } from "@/actions/media/upload-poster";
import {
  getMovieAction,
  searchMoviesAction,
} from "@/actions/movie/movie-assist";
import { createRecordAction } from "@/actions/record/save-record";
import { RecordCreateForm } from "@/components/organisms/record-create-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { buildLanguageOptions } from "@/lib/record/language-options";
import { emptyFormValues, maxReleaseYear } from "@/lib/record/to-form-values";

export default async function NewRecordPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  const today = new Date();
  const values = emptyFormValues();

  return (
    <RecordCreateForm
      lang={lang}
      action={createRecordAction.bind(null, lang)}
      searchMovies={searchMoviesAction.bind(null, lang)}
      getMovie={getMovieAction.bind(null, lang)}
      uploadPoster={uploadPosterAction}
      values={values}
      languageOptions={buildLanguageOptions(
        lang,
        values.language,
        dict.recordForm.languageUnknown,
      )}
      maxReleaseYear={maxReleaseYear(today)}
      dict={dict.recordForm}
      enums={dict.enums}
      counterTemplate={dict.characterCount}
    />
  );
}
