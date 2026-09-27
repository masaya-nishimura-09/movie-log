import { getFrequentPlatforms } from "@/api/record/get-frequent-platforms";
import { RecordCreateForm } from "@/components/organisms/record-create-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { buildLanguageOptions } from "@/lib/record/language-options";
import { emptyFormValues, maxReleaseYear } from "@/lib/record/to-form-values";

export default async function NewRecordPage() {
  const [lang, dict, frequentPlatforms] = await Promise.all([
    getLocale(),
    getDictionary(),
    getFrequentPlatforms(6),
  ]);
  const today = new Date();
  const values = emptyFormValues(today);

  return (
    <RecordCreateForm
      lang={lang}
      values={values}
      frequentPlatforms={frequentPlatforms}
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
