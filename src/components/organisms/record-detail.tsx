import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { GenreTag } from "@/components/atoms/genre-tag";
import { MoodTag } from "@/components/atoms/mood-tag";
import { ScoreBadge } from "@/components/atoms/score-badge";
import { RecordPoster } from "@/components/molecules/record-poster";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { formatDate } from "@/lib/date/format-date";
import { languageName } from "@/lib/record/language-options";
import { interpolate } from "@/lib/text/interpolate";
import type { MovieRecord } from "@/schemas/record/record";

type RecordDetailProps = {
  lang: Locale;
  record: MovieRecord;
  newer: MovieRecord | undefined;
  older: MovieRecord | undefined;
  dict: Dictionary;
};

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-bold font-sans text-muted-foreground text-xs tracking-[0.08em]">
      {children}
    </h2>
  );
}

export function RecordDetail({
  lang,
  record,
  newer,
  older,
  dict,
}: RecordDetailProps) {
  const d = dict.recordDetail;
  const regionNames = new Intl.DisplayNames(lang, { type: "region" });
  const year =
    record.releaseYear > 0
      ? interpolate(d.releaseYear, { year: record.releaseYear })
      : "";
  const runtime =
    record.runtime > 0
      ? interpolate(d.runtime, { minutes: record.runtime })
      : "";
  const language = languageName(
    lang,
    record.language,
    dict.recordForm.languageUnknown,
  );
  const countries = record.countries.map(
    (code) => regionNames.of(code) ?? code,
  );
  const meta = [year, runtime, language, ...countries].filter(Boolean);
  const platformLabel = dict.enums.platform[record.platform];
  const scoreLabel = interpolate(dict.recordCard.score, {
    score: record.score,
  });

  const watchedCard = (
    <dl className="flex gap-6 rounded-2xl border bg-card p-4 xl:flex-col xl:gap-4 xl:p-5">
      <div className="flex flex-col gap-1">
        <dt className="text-muted-foreground text-xs">{d.watchedAt}</dt>
        <dd className="font-bold font-heading text-[15px] text-foreground xl:text-[19px]">
          {formatDate(record.watchedAt, lang, "longDate")}
          <span className="font-medium font-sans text-[13px] text-foreground-sub">
            {interpolate(d.weekday, {
              weekday: formatDate(record.watchedAt, lang, "weekday"),
            })}
          </span>
        </dd>
      </div>
      <div className="hidden h-px bg-border xl:block" />
      <div className="flex flex-col gap-1">
        <dt className="text-muted-foreground text-xs">{d.platform}</dt>
        <dd className="text-[15px] text-foreground">{platformLabel}</dd>
      </div>
    </dl>
  );

  const adjacent = (newer || older) && (
    <nav
      aria-label={d.adjacent}
      className="flex flex-col gap-2.25 rounded-2xl border border-input bg-header px-5 py-4.5"
    >
      <h2 className="font-bold font-sans text-[12.5px] text-foreground">
        {d.adjacent}
      </h2>
      {newer && (
        <Link
          href={`/${lang}/records/${newer.recordId}`}
          className="flex items-center gap-2 text-[12.5px] text-foreground-sub hover:text-foreground"
        >
          <ChevronLeft
            className="size-4.25 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <span className="truncate">
            {interpolate(d.adjacentItem, {
              title: newer.title,
              date: formatDate(newer.watchedAt, lang, "short"),
            })}
          </span>
        </Link>
      )}
      {older && (
        <Link
          href={`/${lang}/records/${older.recordId}`}
          className="flex items-center gap-2 text-[12.5px] text-foreground-sub hover:text-foreground"
        >
          <span className="truncate">
            {interpolate(d.adjacentItem, {
              title: older.title,
              date: formatDate(older.watchedAt, lang, "short"),
            })}
          </span>
          <ChevronRight
            className="size-4.25 shrink-0 text-muted-foreground"
            aria-hidden
          />
        </Link>
      )}
    </nav>
  );

  return (
    <article className="mx-auto grid w-full max-w-295 gap-6 px-4 pt-5 pb-10 md:grid-cols-[232px_minmax(0,1fr)] md:gap-9 md:px-10 md:pt-8 xl:grid-cols-[232px_minmax(0,1fr)_300px]">
      <div className="flex gap-4 md:flex-col md:gap-3.5">
        <RecordPoster
          title={record.title}
          posterUrl={record.posterUrl}
          year={record.releaseYear > 0 ? String(record.releaseYear) : ""}
          platformLabel={platformLabel}
          size="detail"
          sizes="(min-width: 768px) 232px, 116px"
          className="w-29 shrink-0 rounded-xl border md:w-full md:rounded-2xl"
        />
        <div className="flex min-w-0 flex-col gap-3 md:hidden">
          <ScoreBadge
            score={record.score}
            size="md"
            label={scoreLabel}
            caption={d.scoreCaption}
          />
          <h1 className="font-bold text-foreground text-xl leading-[1.35]">
            {record.title}
          </h1>
          <p className="text-[13px] text-foreground-sub leading-relaxed">
            {[year, runtime].filter(Boolean).join(" ・ ")}
            <br />
            {[language, ...countries].join(" ・ ")}
          </p>
        </div>
        <div className="hidden flex-col gap-1 px-0.5 text-muted-foreground text-xs md:flex">
          <span>
            {d.createdAt} {formatDate(record.createdAt, lang, "dateTime")}
          </span>
          <span>
            {d.updatedAt} {formatDate(record.updatedAt, lang, "dateTime")}
          </span>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-6.5">
        <div className="flex flex-col gap-3">
          <div className="hidden items-start gap-4 md:flex">
            <ScoreBadge
              score={record.score}
              size="lg"
              label={scoreLabel}
              caption={d.scoreCaption}
            />
            <div className="flex min-w-0 flex-col gap-2.25 pt-0.5">
              <h1 className="font-bold text-[29px] text-foreground leading-[1.35]">
                {record.title}
              </h1>
              <p className="flex flex-wrap gap-2.5 text-foreground-sub text-sm">
                {meta.map((item, index) => (
                  <span key={item} className="flex gap-2.5">
                    {index > 0 && (
                      <span className="text-genre" aria-hidden>
                        |
                      </span>
                    )}
                    {item}
                  </span>
                ))}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.75">
            {record.genres.map((genre) => (
              <GenreTag key={genre}>{dict.enums.genre[genre]}</GenreTag>
            ))}
            {record.moodTags.map((mood) => (
              <MoodTag key={mood}>{dict.enums.moodTag[mood]}</MoodTag>
            ))}
          </div>
        </div>

        <div className="xl:hidden">{watchedCard}</div>

        {record.memo !== "" && (
          <section className="flex flex-col gap-2.5">
            <SectionLabel>{d.memo}</SectionLabel>
            <p className="whitespace-pre-wrap text-pretty rounded-2xl border bg-card px-5.5 py-5 text-[15px] text-foreground leading-loose">
              {record.memo}
            </p>
          </section>
        )}

        {record.credits.length > 0 && (
          <section className="flex flex-col gap-3">
            <SectionLabel>{d.credits}</SectionLabel>
            <dl className="grid gap-x-7 gap-y-2.5 md:grid-cols-2">
              {record.credits.map((credit, index) => (
                <div
                  key={`${credit.creditRole}-${credit.personName}-${index}`}
                  className="flex items-baseline gap-3 border-b border-dashed pb-2.25"
                >
                  <dt className="min-w-15.5 shrink-0 whitespace-nowrap text-muted-foreground text-xs">
                    {dict.enums.creditRole[credit.creditRole]}
                  </dt>
                  <dd className="text-foreground text-sm">
                    {credit.personName}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {adjacent && <div className="xl:hidden">{adjacent}</div>}
      </div>

      <div className="hidden flex-col gap-3.5 xl:flex">
        {watchedCard}
        {adjacent}
      </div>
    </article>
  );
}
