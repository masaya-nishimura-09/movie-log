"use client";

import { useRouter } from "next/navigation";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useSyncExternalStore,
} from "react";
import { LocalDate } from "@/components/atoms/local-date";
import { StarRating } from "@/components/atoms/star-rating";
import { NotebookPage } from "@/components/molecules/notebook-page";
import { TocChapterHeading } from "@/components/molecules/toc-chapter-heading";
import { TocRow } from "@/components/molecules/toc-row";
import { RingNotebook } from "@/components/organisms/ring-notebook";
import { usePageKeys } from "@/hooks/use-page-keys";
import { useSwipe } from "@/hooks/use-swipe";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { timeZoneCookie } from "@/lib/date/time-zone";
import { splitToc, type TocItem, tocItems } from "@/lib/notebook/split-toc";
import { type TocHeading, tocChapters } from "@/lib/record/toc-chapters";
import { interpolate } from "@/lib/text/interpolate";
import { withFrom } from "@/lib/url/back-href";
import type { RecordSort } from "@/schemas/record/list";
import type { MovieRecord } from "@/schemas/record/record";

type RecordTocProps = {
  lang: Locale;
  records: MovieRecord[];
  sort: RecordSort;
  initialTimeZone: string;
  header: ReactNode;
  filterBar: ReactNode;
  emptyContent: ReactNode;
  pageNumbers: [number, number];
  mobilePageNumber: number;
  prevHref?: string;
  nextHref?: string;
  fromHref?: string;
  dict: Pick<
    Dictionary,
    "enums" | "recordCard" | "recordList" | "recordDetail"
  >;
};

const headerSlots = 1.5;
const filterBarSlots = 1;
const pageSlots = 10;

function subscribeNothing() {
  return () => {};
}

function browserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function useTimeZone(initial: string): string {
  const timeZone = useSyncExternalStore(
    subscribeNothing,
    browserTimeZone,
    () => initial,
  );
  useEffect(() => {
    if (timeZone === initial) return;
    // biome-ignore lint/suspicious/noDocumentCookie: the server reads this cookie to group chapters by the same time zone
    document.cookie = `${timeZoneCookie}=${encodeURIComponent(timeZone)}; path=/; max-age=31536000; samesite=lax`;
  }, [timeZone, initial]);
  return timeZone;
}

function headingLabel(
  heading: TocHeading,
  previous: TocHeading | null,
  lang: Locale,
  dict: RecordTocProps["dict"],
): ReactNode {
  if (heading.kind === "score") {
    return (
      <StarRating
        score={heading.score}
        max={heading.score}
        label={interpolate(dict.recordDetail.scoreValue, {
          score: heading.score,
        })}
        className="text-[13px] lg:text-sm"
      />
    );
  }
  if (heading.kind === "year") {
    return heading.year > 0
      ? interpolate(dict.recordDetail.releaseYear, { year: heading.year })
      : dict.recordList.unknownYear;
  }
  const sameYear = previous?.kind === "month" && previous.year === heading.year;
  return new Intl.DateTimeFormat(lang, {
    timeZone: "UTC",
    year: sameYear ? undefined : "numeric",
    month: "long",
  }).format(new Date(Date.UTC(heading.year, heading.month - 1, 15)));
}

export function RecordToc({
  lang,
  records,
  sort,
  initialTimeZone,
  header,
  filterBar,
  emptyContent,
  pageNumbers,
  mobilePageNumber,
  prevHref,
  nextHref,
  fromHref,
  dict,
}: RecordTocProps) {
  const router = useRouter();
  const timeZone = useTimeZone(initialTimeZone);
  const chapters = tocChapters(records, sort, timeZone);
  const shapes = chapters.map((chapter) => ({
    hasHeading: chapter.heading !== null,
    rows: chapter.records.length,
  }));
  const slots = Math.floor(
    pageSlots - headerSlots - (filterBar ? filterBarSlots : 0),
  );
  const { left, right } = splitToc(shapes, slots);

  const goPrev = useCallback(() => {
    if (prevHref) router.push(prevHref);
  }, [prevHref, router]);
  const goNext = useCallback(() => {
    if (nextHref) router.push(nextHref);
  }, [nextHref, router]);
  usePageKeys(goPrev, goNext);
  const swipe = useSwipe(goPrev, goNext);

  const renderItem = (item: TocItem) => {
    const chapter = chapters[item.chapter];
    if (!chapter) return null;
    if (item.type === "chapter") {
      if (!chapter.heading) return null;
      const previous = chapters[item.chapter - 1]?.heading ?? null;
      return (
        <li key={`${chapter.key}-${item.continued}`}>
          <TocChapterHeading
            note={item.continued ? dict.recordList.continued : undefined}
          >
            {headingLabel(chapter.heading, previous, lang, dict)}
          </TocChapterHeading>
        </li>
      );
    }
    const record = chapter.records[item.row];
    if (!record) return null;
    return (
      <li key={record.recordId}>
        <TocRow
          href={withFrom(`/${lang}/records/${record.recordId}`, fromHref)}
          title={record.title}
          posterUrl={record.posterUrl}
          noPosterLabel={dict.recordCard.noPoster}
          meta={[
            record.releaseYear > 0 ? String(record.releaseYear) : "",
            dict.enums.platform[record.platform],
          ]
            .filter(Boolean)
            .join(" · ")}
          watched={
            <LocalDate
              date={record.watchedAt}
              locale={lang}
              dateStyle={sort.startsWith("watchedAt") ? "short" : "medium"}
            />
          }
          score={record.score}
          scoreLabel={interpolate(dict.recordDetail.scoreValue, {
            score: record.score,
          })}
        />
      </li>
    );
  };

  const list = (items: TocItem[]) =>
    items.length > 0 && <ol>{items.map(renderItem)}</ol>;

  const pageLabel = (page: number) =>
    interpolate(dict.recordDetail.pageLabel, { page });
  const number = (page: number) => <span className="tabular-nums">{page}</span>;

  return (
    <div
      className="h-full"
      onPointerDown={swipe.onPointerDown}
      onPointerUp={swipe.onPointerUp}
    >
      <RingNotebook variant="spread" className="hidden lg:flex">
        <NotebookPage
          side="left"
          label={pageLabel(pageNumbers[0])}
          footer={number(pageNumbers[0])}
        >
          {header}
          {filterBar}
          {emptyContent ?? list(left)}
        </NotebookPage>
        <NotebookPage
          side="right"
          label={pageLabel(pageNumbers[1])}
          footer={number(pageNumbers[1])}
        >
          {emptyContent === null && list(right)}
        </NotebookPage>
      </RingNotebook>
      <RingNotebook variant="single" className="h-full lg:hidden">
        <NotebookPage
          side="single"
          label={pageLabel(mobilePageNumber)}
          footer={number(mobilePageNumber)}
        >
          {header}
          {filterBar}
          {emptyContent ?? list(tocItems(shapes))}
        </NotebookPage>
      </RingNotebook>
    </div>
  );
}
