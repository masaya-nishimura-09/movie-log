import {
  CalendarDays,
  Clock,
  Languages,
  type LucideIcon,
  MapPin,
} from "lucide-react";
import type { ActionResult } from "@/actions/action-result";
import { GenreTag } from "@/components/atoms/genre-tag";
import { LocalDate } from "@/components/atoms/local-date";
import { MaskingTape } from "@/components/atoms/masking-tape";
import { MoodTag } from "@/components/atoms/mood-tag";
import { ScoreBadge } from "@/components/atoms/score-badge";
import { SectionLabel } from "@/components/atoms/section-label";
import { TextLink } from "@/components/atoms/text-link";
import { NoteSheet } from "@/components/molecules/note-sheet";
import { RecordDetailTabs } from "@/components/molecules/record-detail-tabs";
import { RecordPoster } from "@/components/molecules/record-poster";
import { RecordAttachmentSection } from "@/components/organisms/record-attachment-section";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { languageName } from "@/lib/record/language-options";
import { interpolate } from "@/lib/text/interpolate";
import type { Attachment } from "@/schemas/record/attachment";
import type { RecordDetail as RecordDetailData } from "@/schemas/record/record";

type RecordDetailProps = {
  lang: Locale;
  record: RecordDetailData;
  attachments: Attachment[];
  addAttachment?: (formData: FormData) => Promise<ActionResult<null>>;
  deleteAttachment?: (attachmentId: string) => Promise<ActionResult<null>>;
  dict: Dictionary;
};

function InfoList({
  rows,
}: {
  rows: { key: string; label: string; value: string }[];
}) {
  return (
    <dl className="grid @2xl:grid-cols-2 gap-x-7 gap-y-2.5 rounded-2xl bg-card px-5.5 py-5 2xl:gap-x-10 2xl:gap-y-3.5 2xl:px-7 2xl:py-6">
      {rows.map((row) => (
        <div
          key={row.key}
          className="flex flex-wrap items-baseline justify-between gap-x-3 border-b border-dashed pb-2.25"
        >
          <dt className="shrink-0 whitespace-nowrap text-muted-foreground text-xs 2xl:text-sm">
            {row.label}
          </dt>
          <dd className="ml-auto min-w-0 break-words text-right text-foreground text-sm 2xl:text-lg">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function RecordDetail({
  lang,
  record,
  attachments,
  addAttachment,
  deleteAttachment,
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
  const countries = new Intl.ListFormat(lang).format(
    record.countries.map((code) => regionNames.of(code) ?? code),
  );
  const withIcon = (Icon: LucideIcon, label: string, value: string) => (
    <span className="inline-flex items-start gap-1">
      <span className="flex h-lh shrink-0 items-center">
        <Icon className="size-[1em] text-muted-foreground" aria-hidden />
      </span>
      <span className="sr-only">{label}</span>
      {value}
    </span>
  );
  const countriesItem =
    countries === ""
      ? null
      : withIcon(MapPin, dict.recordForm.countries, countries);
  const languageItem = withIcon(Languages, dict.recordForm.language, language);
  const yearItem =
    year === ""
      ? null
      : withIcon(CalendarDays, dict.recordForm.releaseYear, year);
  const runtimeItem =
    runtime === "" ? null : withIcon(Clock, dict.recordForm.runtime, runtime);
  const meta = [
    { key: "year", node: yearItem },
    { key: "runtime", node: runtimeItem },
    { key: "countries", node: countriesItem },
    { key: "language", node: languageItem },
  ].filter((item) => item.node);
  const platformLabel = dict.enums.platform[record.platform];
  const scoreLabel = interpolate(dict.recordCard.score, {
    score: record.score,
  });

  const watchedCard = (
    <div className="grid grid-cols-2 gap-3">
      <section className="flex flex-col gap-2.5">
        <SectionLabel>{d.watchedAt}</SectionLabel>
        <p className="flex-1 rounded-2xl bg-card px-4 py-4 text-[15px] text-foreground">
          <LocalDate
            date={record.watchedAt}
            locale={lang}
            dateStyle="longDate"
          />
        </p>
      </section>
      <section className="flex flex-col gap-2.5">
        <SectionLabel>{d.platform}</SectionLabel>
        <p className="flex-1 rounded-2xl bg-card px-4 py-4 text-[15px] text-foreground">
          {platformLabel}
        </p>
      </section>
    </div>
  );

  const recordTab = (
    <>
      <div className="md:hidden">{watchedCard}</div>

      {record.moodTags.length > 0 && (
        <section className="flex flex-col gap-2.5">
          <SectionLabel>{d.moodTags}</SectionLabel>
          <div className="flex flex-wrap gap-1.75 2xl:gap-2.5 2xl:[&>*]:px-3.5 2xl:[&>*]:py-2 2xl:[&>*]:text-sm">
            {record.moodTags.map((mood) => (
              <MoodTag key={mood}>{dict.enums.moodTag[mood]}</MoodTag>
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-2.5">
        <SectionLabel>{d.note}</SectionLabel>
        {record.note ? (
          <NoteSheet
            content={record.note.content}
            readMoreLabel={d.noteReadMore}
            showLessLabel={d.noteShowLess}
          />
        ) : (
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-dashed px-5.5 py-5 text-[15px] text-muted-foreground 2xl:px-7 2xl:py-6 2xl:text-lg">
            {d.noteEmpty}
            <TextLink href={`/${lang}/records/${record.recordId}/edit`}>
              {d.noteAdd}
            </TextLink>
          </p>
        )}
      </section>

      <RecordAttachmentSection
        attachments={attachments}
        add={addAttachment}
        remove={deleteAttachment}
        dict={d}
        deleteDict={dict.deleteAttachment}
      />
    </>
  );

  const movieTab = (
    <>
      {record.originalTitle !== "" && record.originalTitle !== record.title && (
        <section className="flex flex-col gap-2.5">
          <SectionLabel>{d.originalTitle}</SectionLabel>
          <p className="text-[15px] text-foreground 2xl:text-lg">
            {record.originalTitle}
          </p>
        </section>
      )}

      <section className="flex flex-col gap-2.5">
        <SectionLabel>{d.overview}</SectionLabel>
        {record.overview !== "" ? (
          <p className="whitespace-pre-wrap text-pretty rounded-2xl bg-card px-5.5 py-5 text-[15px] text-foreground leading-loose 2xl:px-7 2xl:py-6 2xl:text-lg">
            {record.overview}
          </p>
        ) : (
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-dashed px-5.5 py-5 text-[15px] text-muted-foreground 2xl:px-7 2xl:py-6 2xl:text-lg">
            {d.overviewEmpty}
            <TextLink href={`/${lang}/records/${record.recordId}/edit`}>
              {d.overviewAdd}
            </TextLink>
          </p>
        )}
      </section>

      {record.genres.length > 0 && (
        <section className="flex flex-col gap-2.5">
          <SectionLabel>{dict.recordForm.genres}</SectionLabel>
          <div className="flex flex-wrap gap-1.75 2xl:gap-2.5 2xl:[&>*]:px-3.5 2xl:[&>*]:py-2 2xl:[&>*]:text-sm">
            {record.genres.map((genre) => (
              <GenreTag key={genre}>{dict.enums.genre[genre]}</GenreTag>
            ))}
          </div>
        </section>
      )}

      <section className="flex min-w-0 flex-col gap-3">
        <SectionLabel>{d.credits}</SectionLabel>
        {record.credits.length > 0 ? (
          <InfoList
            rows={record.credits.map((credit, index) => ({
              key: `${credit.creditRole}-${credit.personName}-${index}`,
              label: dict.enums.creditRole[credit.creditRole],
              value: credit.personName,
            }))}
          />
        ) : (
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-dashed px-5.5 py-5 text-[15px] text-muted-foreground 2xl:px-7 2xl:py-6 2xl:text-lg">
            {d.creditsEmpty}
            <TextLink href={`/${lang}/records/${record.recordId}/edit`}>
              {d.creditsAdd}
            </TextLink>
          </p>
        )}
      </section>
    </>
  );

  return (
    <article className="mx-auto grid w-full 3xl:grid-cols-[minmax(180px,min(520px,calc((100svh_-_330px)*2/3)))_minmax(0,1fr)] gap-6 px-4 pt-5 pb-10 md:grid-cols-[232px_minmax(0,1fr)] md:gap-9 md:px-10 md:pt-8 xl:grid-cols-[minmax(180px,min(320px,calc((100svh_-_330px)*2/3)))_minmax(0,1fr)] 2xl:grid-cols-[minmax(180px,min(440px,calc((100svh_-_330px)*2/3)))_minmax(0,1fr)]">
      <div className="flex gap-4 md:flex-col md:gap-5">
        <div className="relative w-29 shrink-0 self-start pt-1.5 md:w-full md:self-auto md:pt-2.5">
          <RecordPoster
            posterUrl={record.posterUrl}
            noPosterLabel={dict.recordCard.noPoster}
            sizes="(min-width: 1920px) 520px, (min-width: 1536px) 440px, (min-width: 1280px) 320px, (min-width: 768px) 232px, 116px"
            className="rounded-[3px] shadow-[0_10px_24px_-12px_rgb(10_41_71/0.55)]"
          />
          <MaskingTape className="top-0 h-3.5 w-11 md:top-0 md:h-5.5 md:w-24 2xl:w-32" />
        </div>
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
          <p className="flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-foreground-sub leading-relaxed">
            {meta.map((item) => (
              <span key={item.key}>{item.node}</span>
            ))}
          </p>
        </div>
        <div className="hidden flex-col gap-2 px-0.5 md:flex">
          <p className="flex flex-wrap items-baseline gap-x-2 text-sm 2xl:text-base">
            <span className="font-bold text-foreground tabular-nums">
              <LocalDate
                date={record.watchedAt}
                locale={lang}
                dateStyle="medium"
              />
            </span>
            <span className="text-foreground-sub">{platformLabel}</span>
          </p>
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

      <div className="@container flex min-w-0 flex-col gap-6.5">
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
                <span key={item.key} className="flex gap-2.5">
                  {index > 0 && (
                    <span className="text-genre" aria-hidden>
                      |
                    </span>
                  )}
                  {item.node}
                </span>
              ))}
            </p>
          </div>
        </div>

        <RecordDetailTabs
          tabs={[
            { value: "record", label: d.tabRecord, content: recordTab },
            { value: "movie", label: d.tabMovie, content: movieTab },
          ]}
        />
      </div>
    </article>
  );
}
