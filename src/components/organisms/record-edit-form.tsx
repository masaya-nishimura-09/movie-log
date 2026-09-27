import Link from "next/link";
import type { ReactNode } from "react";
import { Button, buttonVariants } from "@/components/atoms/button";
import { RecordBasicsFields } from "@/components/organisms/record-basics-fields";
import { RecordImpressionFields } from "@/components/organisms/record-impression-fields";
import { RecordMovieFields } from "@/components/organisms/record-movie-fields";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import type { Platform } from "@/schemas/record/enums";
import type {
  RecordFormValues,
  SelectOption,
} from "@/schemas/record/record-form";

type RecordEditFormProps = {
  lang: Locale;
  backHref: string;
  values: RecordFormValues;
  frequentPlatforms: Platform[];
  languageOptions: SelectOption[];
  maxReleaseYear: number;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  counterTemplate: string;
};

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4.5 rounded-[18px] border bg-card p-4.5 md:p-5.5">
      <h2 className="font-bold text-base text-foreground">{title}</h2>
      {children}
    </section>
  );
}

export function RecordEditForm({
  lang,
  backHref,
  values,
  frequentPlatforms,
  languageOptions,
  maxReleaseYear,
  dict,
  enums,
  counterTemplate,
}: RecordEditFormProps) {
  return (
    <form className="mx-auto flex w-full max-w-295 flex-col gap-4 px-4 pt-5 md:px-10 md:pt-8">
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Panel title={dict.watchSection}>
            <RecordBasicsFields
              values={values}
              frequentPlatforms={frequentPlatforms}
              dict={dict}
              enums={enums}
              counterTemplate={counterTemplate}
            />
          </Panel>
          <Panel title={dict.stepImpression}>
            <RecordImpressionFields
              values={values}
              dict={dict}
              enums={enums}
              counterTemplate={counterTemplate}
            />
          </Panel>
        </div>
        <Panel title={dict.movieSection}>
          <RecordMovieFields
            lang={lang}
            values={values}
            languageOptions={languageOptions}
            maxReleaseYear={maxReleaseYear}
            dict={dict}
            enums={enums}
          />
        </Panel>
      </div>

      <div className="sticky bottom-0 -mx-4 flex justify-end gap-2 border-t bg-background/95 px-4 py-3 backdrop-blur md:mx-0 md:mb-6 md:rounded-[18px] md:border md:bg-card md:px-5">
        <Link
          href={backHref}
          className={buttonVariants({ variant: "outline" })}
        >
          {dict.cancel}
        </Link>
        <Button type="button">{dict.saveChanges}</Button>
      </div>
    </form>
  );
}
