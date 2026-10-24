import { LocalDate } from "@/components/atoms/local-date";
import { RecordCard } from "@/components/molecules/record-card";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { interpolate } from "@/lib/text/interpolate";
import { withFrom } from "@/lib/url/back-href";
import type { MovieRecord } from "@/schemas/record/record";

type RecordItemCardProps = {
  lang: Locale;
  record: MovieRecord;
  dict: Pick<Dictionary, "enums" | "recordCard">;
  fromHref?: string;
};

export function RecordItemCard({
  lang,
  record,
  dict,
  fromHref,
}: RecordItemCardProps) {
  const year = record.releaseYear > 0 ? String(record.releaseYear) : "";
  const platformLabel = dict.enums.platform[record.platform];

  return (
    <RecordCard
      href={withFrom(`/${lang}/records/${record.recordId}`, fromHref)}
      title={record.title}
      posterUrl={record.posterUrl}
      score={record.score}
      scoreLabel={interpolate(dict.recordCard.score, { score: record.score })}
      meta={[year, platformLabel].filter(Boolean).join(" · ")}
      watchedStamp={
        <LocalDate date={record.watchedAt} locale={lang} dateStyle="short" />
      }
      noPosterLabel={dict.recordCard.noPoster}
    />
  );
}
