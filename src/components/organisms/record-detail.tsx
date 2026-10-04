import Link from "next/link";
import type { ReactNode } from "react";
import { GenreTag } from "@/components/atoms/genre-tag";
import { LocalDate } from "@/components/atoms/local-date";
import { MoodTag } from "@/components/atoms/mood-tag";
import { ScoreBadge } from "@/components/atoms/score-badge";
import { RecordPoster } from "@/components/molecules/record-poster";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { languageName } from "@/lib/record/language-options";
import { interpolate } from "@/lib/text/interpolate";
import { interpolateNode } from "@/lib/text/interpolate-node";
import type { MovieRecord } from "@/schemas/record/record";

type RecordDetailProps = {
  lang: Locale;
  record: MovieRecord;
  dict: Dictionary;
};

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-bold text-muted-foreground text-xs tracking-[0.08em]">
      {children}
    </h2>
  );
}

export function RecordDetail({ lang, record, dict }: RecordDetailProps) {
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
    <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
      <section className="flex flex-col gap-2.5">
        <SectionLabel>{d.watchedAt}</SectionLabel>
        <p className="rounded-2xl border bg-card px-5.5 py-4 font-bold text-[15px] text-foreground">
          <LocalDate
            date={record.watchedAt}
            locale={lang}
            dateStyle="longDate"
          />
          <span className="font-medium text-[13px] text-foreground-sub">
            {interpolateNode(d.weekday, {
              weekday: (
                <LocalDate
                  date={record.watchedAt}
                  locale={lang}
                  dateStyle="weekday"
                />
              ),
            })}
          </span>
        </p>
      </section>
      <section className="flex flex-col gap-2.5">
        <SectionLabel>{d.platform}</SectionLabel>
        <p className="rounded-2xl border bg-card px-5.5 py-4 text-[15px] text-foreground">
          {platformLabel}
        </p>
      </section>
    </div>
  );

  return (
    <article className="mx-auto grid w-full gap-6 px-4 pt-5 pb-10 md:grid-cols-[232px_minmax(0,1fr)] md:gap-9 md:px-10 md:pt-8 xl:grid-cols-[232px_minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(232px,320px)_minmax(0,1fr)_340px]">
      <div className="flex gap-4 md:flex-col md:gap-3.5">
        <RecordPoster
          title={record.title}
          posterUrl={record.posterUrl}
          year={record.releaseYear > 0 ? String(record.releaseYear) : ""}
          platformLabel={platformLabel}
          size="detail"
          sizes="(min-width: 1536px) 320px, (min-width: 768px) 232px, 116px"
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
            {d.createdAt}{" "}
            <LocalDate
              date={record.createdAt}
              locale={lang}
              dateStyle="dateTime"
            />
          </span>
          <span>
            {d.updatedAt}{" "}
            <LocalDate
              date={record.updatedAt}
              locale={lang}
              dateStyle="dateTime"
            />
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

        {watchedCard}

        <section className="flex flex-col gap-2.5">
          <SectionLabel>{d.memo}</SectionLabel>
          {record.memo !== "" ? (
            <p className="max-w-3xl whitespace-pre-wrap text-pretty rounded-2xl border bg-card px-5.5 py-5 text-[15px] text-foreground leading-loose">
              {record.memo}
            </p>
          ) : (
            <p className="flex max-w-3xl flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-dashed px-5.5 py-5 text-[15px] text-muted-foreground">
              {d.memoEmpty}
              <Link
                href={`/${lang}/records/${record.recordId}/edit`}
                className="rounded-sm text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
              >
                {d.memoAdd}
              </Link>
            </p>
          )}
        </section>
      </div>
      {record.credits.length > 0 && (
        <section className="flex min-w-0 flex-col gap-3 md:col-start-2 xl:col-start-3 xl:row-start-1">
          <SectionLabel>{d.credits}</SectionLabel>
          <dl className="grid gap-x-7 gap-y-2.5 md:grid-cols-2 xl:grid-cols-1">
            {record.credits.map((credit, index) => (
              <div
                key={`${credit.creditRole}-${credit.personName}-${index}`}
                className="flex items-baseline justify-between gap-3 border-b border-dashed pb-2.25"
              >
                <dt className="shrink-0 whitespace-nowrap text-muted-foreground text-xs">
                  {dict.enums.creditRole[credit.creditRole]}
                </dt>
                <dd className="text-right text-foreground text-sm">
                  {credit.personName}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </article>
  );
}
