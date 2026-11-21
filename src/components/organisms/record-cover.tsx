import { LocalDate } from "@/components/atoms/local-date";
import { MaskingTape } from "@/components/atoms/masking-tape";
import { NotebookHeading } from "@/components/atoms/notebook-heading";
import { phrases } from "@/components/atoms/phrases";
import { StarRating } from "@/components/atoms/star-rating";
import { NotebookFields } from "@/components/molecules/notebook-fields";
import { RecordPoster } from "@/components/molecules/record-poster";
import { PosterViewer } from "@/components/organisms/poster-viewer";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import type { MovieInfoRow } from "@/lib/record/movie-info-rows";
import { interpolate } from "@/lib/text/interpolate";
import type { RecordDetail } from "@/schemas/record/record";

type RecordCoverProps = {
  lang: Locale;
  record: RecordDetail;
  dict: Dictionary;
};

export function RecordCoverHeader({ lang, record, dict }: RecordCoverProps) {
  const d = dict.recordDetail;
  const poster = (
    <RecordPoster
      posterUrl={record.posterUrl}
      noPosterLabel={dict.recordCard.noPoster}
      sizes="(min-width: 1024px) 152px, 104px"
      className="aspect-auto h-39 shadow-[0_8px_16px_rgb(10_41_71/0.2)] lg:h-56 lg:shadow-[0_10px_20px_rgb(10_41_71/0.2)]"
    />
  );
  const rows = [
    {
      key: "watchedAt",
      label: d.watchedAt,
      value: (
        <LocalDate
          date={record.watchedAt}
          locale={lang}
          dateStyle="mediumWeekday"
        />
      ),
    },
    {
      key: "platform",
      label: d.platform,
      value: dict.enums.platform[record.platform],
    },
    {
      key: "score",
      label: d.score,
      value: (
        <StarRating
          score={record.score}
          label={interpolate(d.scoreValue, { score: record.score })}
          className="text-xs lg:gap-0.75 lg:text-sm"
        />
      ),
    },
    ...(record.moodTags.length > 0
      ? [
          {
            key: "moodTags",
            label: d.moodTags,
            value: record.moodTags
              .map((mood) => dict.enums.moodTag[mood])
              .join(d.moodSeparator),
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-wrap items-start gap-3.5 lg:gap-7">
      <figure className="relative w-26 shrink-0 lg:w-38">
        {record.posterUrl === "" ? (
          poster
        ) : (
          <PosterViewer
            posterUrl={record.posterUrl}
            title={record.title}
            openLabel={d.posterOpen}
            closeLabel={d.attachmentClose}
          >
            {poster}
          </PosterViewer>
        )}
        <MaskingTape className="hidden w-20 lg:block" />
      </figure>
      <div className="min-w-0 flex-1 basis-40 text-xs leading-7 lg:text-sm">
        <h1 className="break-words font-bold font-display text-[19px] leading-7 lg:text-[26px]">
          {phrases(record.title)}
        </h1>
        {record.originalTitle !== "" &&
          record.originalTitle !== record.title && (
            <p className="text-[10px] text-paper-muted italic leading-7 lg:text-xs">
              {record.originalTitle}
            </p>
          )}
        <NotebookFields size="md" rows={rows} className="lg:mt-7" />
      </div>
    </div>
  );
}

export function RecordMovieInfo({
  label,
  rows,
}: {
  label: string;
  rows: MovieInfoRow[];
}) {
  return (
    <section>
      <NotebookHeading>{label}</NotebookHeading>
      <NotebookFields size="lg" rows={rows} />
    </section>
  );
}

export function RecordOverview({
  label,
  overview,
}: {
  label: string;
  overview: string;
}) {
  return (
    <section>
      <NotebookHeading>{label}</NotebookHeading>
      <p className="whitespace-pre-wrap">{overview}</p>
    </section>
  );
}
