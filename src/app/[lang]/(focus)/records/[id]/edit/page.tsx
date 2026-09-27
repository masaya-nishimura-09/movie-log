import { notFound } from "next/navigation";
import { getFrequentPlatforms } from "@/api/record/get-frequent-platforms";
import { getRecord } from "@/api/record/get-record";
import { PageTopBar } from "@/components/organisms/page-top-bar";
import { RecordEditForm } from "@/components/organisms/record-edit-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { buildLanguageOptions } from "@/lib/record/language-options";
import { maxReleaseYear, toFormValues } from "@/lib/record/to-form-values";

export default async function EditRecordPage({
  params,
}: PageProps<"/[lang]/records/[id]/edit">) {
  const { id } = await params;
  const [lang, dict, record, frequentPlatforms] = await Promise.all([
    getLocale(),
    getDictionary(),
    getRecord(id),
    getFrequentPlatforms(6),
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
        backHref={backHref}
        values={values}
        frequentPlatforms={frequentPlatforms}
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
