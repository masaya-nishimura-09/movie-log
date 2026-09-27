import { RecordCard } from "@/components/molecules/record-card";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { formatDate } from "@/lib/date/format-date";
import { groupByMonth } from "@/lib/record/group-by-month";
import { interpolate } from "@/lib/text/interpolate";
import type { MovieRecord } from "@/schemas/record/record";

type RecordGridProps = {
  lang: Locale;
  records: MovieRecord[];
  groupedByMonth: boolean;
  dict: Dictionary;
};

function Grid({
  lang,
  records,
  dict,
}: Omit<RecordGridProps, "groupedByMonth">) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3.5">
      {records.map((record) => {
        const year = record.releaseYear > 0 ? String(record.releaseYear) : "";
        const platformLabel = dict.enums.platform[record.platform];
        const watchedShort = formatDate(record.watchedAt, lang, "short");
        return (
          <li key={record.recordId} className="flex">
            <RecordCard
              href={`/${lang}/records/${record.recordId}`}
              title={record.title}
              posterUrl={record.posterUrl}
              score={record.score}
              scoreLabel={interpolate(dict.recordCard.score, {
                score: record.score,
              })}
              year={year}
              platformLabel={platformLabel}
              meta={[year, platformLabel, watchedShort]
                .filter(Boolean)
                .join(" · ")}
              watchedLabel={interpolate(dict.recordCard.watched, {
                date: watchedShort,
              })}
              noPosterLabel={dict.recordCard.noPoster}
            />
          </li>
        );
      })}
    </ul>
  );
}

export function RecordGrid({
  lang,
  records,
  groupedByMonth,
  dict,
}: RecordGridProps) {
  if (!groupedByMonth) {
    return <Grid lang={lang} records={records} dict={dict} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {groupByMonth(records).map((group) => (
        <section key={group.key} className="flex flex-col gap-3.25">
          <div className="flex items-center gap-2.75">
            <h2 className="font-bold text-[15px] text-foreground">
              {formatDate(group.firstWatchedAt, lang, "month")}
            </h2>
            <span className="text-muted-foreground text-xs">
              {interpolate(dict.recordList.monthCount, {
                count: group.records.length,
              })}
            </span>
            <span className="h-px flex-1 bg-input" />
          </div>
          <Grid lang={lang} records={group.records} dict={dict} />
        </section>
      ))}
    </div>
  );
}
