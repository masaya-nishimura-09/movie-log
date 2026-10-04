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
    <h2 className="font-bold text-muted-foreground text-xs tracking-[0.08em] 2xl:text-sm">
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
    <div className="grid max-w-4xl gap-4 sm:grid-cols-2">
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
    <article className="mx-auto grid w-full 3xl:grid-cols-[minmax(180px,min(520px,calc((100svh_-_330px)*2/3)))_minmax(0,1fr)] gap-6 px-4 pt-5 pb-10 md:grid-cols-[232px_minmax(0,1fr)] md:gap-9 md:px-10 md:pt-8 xl:grid-cols-[minmax(180px,min(320px,calc((100svh_-_330px)*2/3)))_minmax(0,1fr)] 2xl:grid-cols-[minmax(180px,min(440px,calc((100svh_-_330px)*2/3)))_minmax(0,1fr)]">
      <div className="flex gap-4 md:flex-col md:gap-3.5">
        <div className="contents md:relative md:block md:rounded-2xl md:border md:bg-card">
          <RecordPoster
            title={record.title}
            posterUrl={record.posterUrl}
            year={record.releaseYear > 0 ? String(record.releaseYear) : ""}
            platformLabel={platformLabel}
            size="detail"
            sizes="(min-width: 1920px) 520px, (min-width: 1536px) 440px, (min-width: 1280px) 320px, (min-width: 768px) 232px, 116px"
            className="w-29 shrink-0 rounded-xl border md:w-full md:rounded-t-[calc(var(--radius-2xl)-1px)] md:rounded-b-none md:border-0"
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
          <div aria-hidden className="relative hidden h-0 md:block">
            <div className="absolute inset-x-3 top-0 border-input border-t border-dashed" />
            <span className="absolute -top-2 -left-[9px] size-4 rounded-full border bg-background [clip-path:inset(0_0_0_50%)]" />
            <span className="absolute -top-2 -right-[9px] size-4 rounded-full border bg-background [clip-path:inset(0_50%_0_0)]" />
          </div>
          <div className="hidden flex-col gap-3 px-4 py-4 md:flex">
            <div className="flex items-center justify-between gap-3">
              <span className="shrink-0 -rotate-3 rounded-sm border-2 border-primary/60 px-2 py-0.5 font-bold text-primary/80 text-xs tabular-nums tracking-wider 2xl:text-sm">
                <LocalDate
                  date={record.watchedAt}
                  locale={lang}
                  dateStyle="medium"
                />
              </span>
              <span className="min-w-0 truncate text-foreground-sub text-sm 2xl:text-base">
                {platformLabel}
              </span>
            </div>
            <div className="flex flex-col gap-1 text-muted-foreground text-xs 2xl:text-sm">
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
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-6.5">
        <div className="flex flex-col gap-3">
          <div className="hidden items-start gap-4 md:flex">
            <ScoreBadge
              score={record.score}
              size="lg"
              className="2xl:size-24 2xl:rounded-[26px] 2xl:text-5xl"
              label={scoreLabel}
              caption={d.scoreCaption}
            />
            <div className="flex min-w-0 flex-col gap-2.25 pt-0.5">
              <h1 className="font-bold text-[29px] text-foreground leading-[1.35] 2xl:text-[42px]">
                {record.title}
              </h1>
              <p className="flex flex-wrap gap-2.5 text-foreground-sub text-sm 2xl:text-lg">
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
          <div className="flex flex-wrap gap-1.75 2xl:gap-2.5 2xl:[&>*]:px-3.5 2xl:[&>*]:py-2 2xl:[&>*]:text-sm">
            {record.genres.map((genre) => (
              <GenreTag key={genre}>{dict.enums.genre[genre]}</GenreTag>
            ))}
            {record.moodTags.map((mood) => (
              <MoodTag key={mood}>{dict.enums.moodTag[mood]}</MoodTag>
            ))}
          </div>
        </div>

        <div className="md:hidden">{watchedCard}</div>

        <section className="flex flex-col gap-2.5">
          <SectionLabel>{d.memo}</SectionLabel>
          {record.memo !== "" ? (
            <p className="max-w-4xl whitespace-pre-wrap text-pretty rounded-2xl border bg-card px-5.5 py-5 text-[15px] text-foreground leading-loose 2xl:max-w-5xl 2xl:px-7 2xl:py-6 2xl:text-lg">
              {record.memo}
            </p>
          ) : (
            <p className="flex max-w-4xl flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-dashed px-5.5 py-5 text-[15px] text-muted-foreground 2xl:max-w-5xl 2xl:px-7 2xl:py-6 2xl:text-lg">
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

        <section className="flex min-w-0 flex-col gap-3">
          <SectionLabel>{d.credits}</SectionLabel>
          {record.credits.length > 0 ? (
            <dl className="grid max-w-4xl gap-x-7 gap-y-2.5 md:grid-cols-2 2xl:max-w-5xl 2xl:gap-x-10 2xl:gap-y-3.5">
              {record.credits.map((credit, index) => (
                <div
                  key={`${credit.creditRole}-${credit.personName}-${index}`}
                  className="flex items-baseline justify-between gap-3 border-b border-dashed pb-2.25"
                >
                  <dt className="shrink-0 whitespace-nowrap text-muted-foreground text-xs 2xl:text-sm">
                    {dict.enums.creditRole[credit.creditRole]}
                  </dt>
                  <dd className="text-right text-foreground text-sm 2xl:text-lg">
                    {credit.personName}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="flex max-w-4xl flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-dashed px-5.5 py-5 text-[15px] text-muted-foreground 2xl:max-w-5xl 2xl:px-7 2xl:py-6 2xl:text-lg">
              {d.creditsEmpty}
              <Link
                href={`/${lang}/records/${record.recordId}/edit`}
                className="rounded-sm text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
              >
                {d.creditsAdd}
              </Link>
            </p>
          )}
        </section>
      </div>
    </article>
  );
}
