import { LocalDate } from "@/components/atoms/local-date";
import { RecordCard } from "@/components/molecules/record-card";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { interpolate } from "@/lib/text/interpolate";
import { withFrom } from "@/lib/url/back-href";
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
      {records.map((record) => {
        const year = record.releaseYear > 0 ? String(record.releaseYear) : "";
        const platformLabel = dict.enums.platform[record.platform];
        const watchedShort = (
          <LocalDate date={record.watchedAt} locale={lang} dateStyle="short" />
        );
        return (
          <li key={record.recordId} className="flex">
            <RecordCard
              href={withFrom(`/${lang}/records/${record.recordId}`, fromHref)}
              title={record.title}
              posterUrl={record.posterUrl}
              score={record.score}
              scoreLabel={interpolate(dict.recordCard.score, {
                score: record.score,
              })}
              meta={[year, platformLabel].filter(Boolean).join(" · ")}
              watchedStamp={watchedShort}
              noPosterLabel={dict.recordCard.noPoster}
            />
          </li>
        );
      })}
    </ul>
  );
}
