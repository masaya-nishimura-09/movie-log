import { RecordItemCard } from "@/components/organisms/record-item-card";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import type { MovieRecord } from "@/schemas/record/record";

type RecordGridProps = {
  lang: Locale;
  records: MovieRecord[];
  dict: Dictionary;
  fromHref?: string;
};

export function RecordGrid({ lang, records, dict, fromHref }: RecordGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {records.map((record) => (
        <li key={record.recordId} className="flex">
          <RecordItemCard
            lang={lang}
            record={record}
            dict={dict}
            fromHref={fromHref}
          />
        </li>
      ))}
    </ul>
  );
}
