"use client";

import { useSearchParams } from "next/navigation";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { LocalDate } from "@/components/atoms/local-date";
import { StarRating } from "@/components/atoms/star-rating";
import { LogoPage } from "@/components/molecules/logo-page";
import { NotebookPage } from "@/components/molecules/notebook-page";
import { SingleFlip, SpreadFlip } from "@/components/molecules/page-flip";
import { PageTurner } from "@/components/molecules/page-turner";
import { TocChapterHeading } from "@/components/molecules/toc-chapter-heading";
import { TocRow } from "@/components/molecules/toc-row";
import { PageLoading } from "@/components/organisms/notebook-loading";
import { NotebookScreen } from "@/components/organisms/notebook-screen";
import { RingNotebook } from "@/components/organisms/ring-notebook";
import { usePageKeys } from "@/hooks/use-page-keys";
import { useSwipe } from "@/hooks/use-swipe";
import { useWideScreen } from "@/hooks/use-wide-screen";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { timeZoneCookie } from "@/lib/date/time-zone";
import { paginateToc, type TocHeights } from "@/lib/notebook/paginate-toc";
import type { TocItem } from "@/lib/notebook/split-toc";
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
  toolbar: ReactNode;
  header: ReactNode;
  filterBar: ReactNode;
  emptyContent: ReactNode;
  baseHref: string;
  dict: Pick<
    Dictionary,
    "enums" | "recordCard" | "recordList" | "recordDetail"
  >;
};

type Layout = "spread" | "single";

type TocPage = { number: number; content: ReactNode };

type Snapshot = {
  href: string;
  prevHref?: string;
  nextHref?: string;
  left: TocPage;
  right: TocPage;
  single: TocPage;
};

type Flip = { dir: 1 | -1; old: Snapshot };

type Measured = { layout: Layout; firstPage: number; page: number };

const fallbackHeights: Record<Layout, TocHeights> = {
  spread: { firstPage: 504, page: 588, chapter: 56, row: 56 },
  single: { firstPage: 392, page: 456, chapter: 48, row: 56 },
};

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
  toolbar,
  header,
  filterBar,
  emptyContent,
  baseHref,
  dict,
}: RecordTocProps) {
  const timeZone = useTimeZone(initialTimeZone);
  const wide = useWideScreen();
  const layout: Layout | null =
    wide === null ? null : wide ? "spread" : "single";
  const chapters = tocChapters(records, sort, timeZone);
  const shapes = chapters.map((chapter) => ({
    hasHeading: chapter.heading !== null,
    rows: chapter.records.length,
  }));

  const spreadScrollRef = useRef<HTMLDivElement>(null);
  const singleScrollRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<Measured | null>(null);
  useLayoutEffect(() => {
    if (layout === null) return;
    const scroller = (layout === "spread" ? spreadScrollRef : singleScrollRef)
      .current;
    const head = headRef.current;
    if (!scroller || !head) return;
    const run = () => {
      const style = getComputedStyle(scroller);
      const page =
        scroller.clientHeight -
        Number.parseFloat(style.paddingTop) -
        Number.parseFloat(style.paddingBottom);
      const firstPage = page - head.offsetHeight;
      setMeasured((current) =>
        current?.layout === layout &&
        current.page === page &&
        current.firstPage === firstPage
          ? current
          : { layout, page, firstPage },
      );
    };
    run();
    const observer = new ResizeObserver(run);
    observer.observe(scroller);
    observer.observe(head);
    document.fonts.ready.then(run);
    return () => observer.disconnect();
  }, [layout]);

  const paginate = (target: Layout) => {
    if (emptyContent) return [[]];
    const heights =
      measured?.layout === target
        ? { ...fallbackHeights[target], ...measured }
        : fallbackHeights[target];
    return paginateToc(shapes, heights);
  };
  const spreadPages = paginate("spread");
  const singlePages = paginate("single");

  const searchParams = useSearchParams();
  const requested = Math.max(0, Number(searchParams.get("page") ?? 1) - 1 || 0);
  const singleStart = Math.min(requested, singlePages.length - 1);
  const lastSpread = spreadPages.length - 1;
  const spreadStart = Math.min(
    requested - (requested % 2),
    lastSpread - (lastSpread % 2),
  );

  const pageHref = useCallback(
    (index: number) => {
      if (index === 0) return baseHref;
      const url = new URL(baseHref, "http://local.invalid");
      url.searchParams.set("page", String(index + 1));
      return `${url.pathname}${url.search}`;
    },
    [baseHref],
  );
  const fromHref = requested === 0 ? baseHref : pageHref(requested);

  const step = layout === "spread" ? 2 : 1;
  const start = layout === "spread" ? spreadStart : singleStart;
  const pageCount =
    layout === "spread" ? spreadPages.length : singlePages.length;
  const hasPrev = layout !== null && start > 0;
  const hasNext = layout !== null && start + step < pageCount;
  const turn = useCallback(
    (to: number) => window.history.pushState(null, "", pageHref(to)),
    [pageHref],
  );
  const goPrev = useCallback(() => {
    if (hasPrev) turn(start - step);
  }, [hasPrev, turn, start, step]);
  const goNext = useCallback(() => {
    if (hasNext) turn(start + step);
  }, [hasNext, turn, start, step]);
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
          href={withFrom(
            `/${lang}/records/${record.recordId}`,
            fromHref === `/${lang}/records` ? undefined : fromHref,
          )}
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

  const list = (items: TocItem[] | undefined) =>
    items && items.length > 0 && <ol>{items.map(renderItem)}</ol>;

  const page = (pages: TocItem[][], index: number): TocPage => ({
    number: index + 1,
    content:
      index === 0 ? (
        <>
          {header}
          {filterBar}
          {emptyContent ?? list(pages[0])}
        </>
      ) : (
        list(pages[index])
      ),
  });

  const pageLabel = (number: number) =>
    interpolate(dict.recordDetail.pageLabel, { page: number });
  const number = (value: number) => (
    <span className="tabular-nums">{value}</span>
  );

  const href = pageHref(start);
  const current: Snapshot = {
    href,
    prevHref: hasPrev ? pageHref(start - step) : undefined,
    nextHref: hasNext ? pageHref(start + step) : undefined,
    left: page(spreadPages, spreadStart),
    right: page(spreadPages, spreadStart + 1),
    single: page(singlePages, singleStart),
  };

  const [flip, setFlip] = useState<Flip | null>(null);
  const lastRef = useRef<Snapshot | null>(null);
  useLayoutEffect(() => {
    const last = lastRef.current;
    if (!last || last.href === href) return;
    const dir = last.nextHref === href ? 1 : last.prevHref === href ? -1 : null;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setFlip(dir && !reduced ? { dir, old: last } : null);
    spreadScrollRef.current?.scrollTo({ top: 0 });
    singleScrollRef.current?.scrollTo({ top: 0 });
  }, [href]);
  useLayoutEffect(() => {
    lastRef.current = current;
  });
  const endFlip = () => setFlip(null);

  const face = (side: "left" | "right" | "single", shown: TocPage) => (
    <NotebookPage
      side={side}
      className="size-full"
      footer={shown.content && number(shown.number)}
    >
      {shown.content}
    </NotebookPage>
  );

  const leftShown = flip?.dir === 1 ? flip.old.left : current.left;
  const rightShown = flip?.dir === -1 ? flip.old.right : current.right;
  const singleShown = flip?.dir === -1 ? flip.old.single : current.single;
  const ready = layout !== null && measured?.layout === layout;
  const shown = (tocPage: TocPage, side: "left" | "right" | "single") => {
    if (ready) return <div className="animate-page-in">{tocPage.content}</div>;
    return side === "left" ? null : <PageLoading />;
  };
  const measure = (
    <div ref={headRef}>
      {header}
      {filterBar}
    </div>
  );

  const spread = (
    <RingNotebook variant="spread">
      <NotebookPage
        side="left"
        label={pageLabel(spreadStart + 1)}
        scrollRef={layout === "spread" ? spreadScrollRef : undefined}
        measure={layout === "spread" ? measure : undefined}
        footer={number(leftShown.number)}
        overlay={
          !ready ? (
            <LogoPage className="absolute inset-0 z-5" />
          ) : (
            layout === "spread" &&
            flip?.dir === -1 && (
              <SpreadFlip
                dir={-1}
                front={face("left", flip.old.left)}
                back={face("right", current.right)}
                onEnd={endFlip}
              />
            )
          )
        }
      >
        {shown(leftShown, "left")}
      </NotebookPage>
      <NotebookPage
        side="right"
        label={pageLabel(spreadStart + 2)}
        footer={rightShown.content && number(rightShown.number)}
        overlay={
          layout === "spread" &&
          flip?.dir === 1 && (
            <SpreadFlip
              dir={1}
              front={face("right", flip.old.right)}
              back={face("left", current.left)}
              onEnd={endFlip}
            />
          )
        }
      >
        {shown(rightShown, "right")}
      </NotebookPage>
    </RingNotebook>
  );

  const single = (
    <RingNotebook variant="single" className="h-full">
      <NotebookPage
        side="single"
        label={pageLabel(singleStart + 1)}
        scrollRef={layout === "single" ? singleScrollRef : undefined}
        measure={layout === "single" ? measure : undefined}
        footer={number(singleShown.number)}
        overlay={
          layout === "single" &&
          flip && (
            <SingleFlip
              dir={flip.dir}
              page={face(
                "single",
                flip.dir === 1 ? flip.old.single : current.single,
              )}
              onEnd={endFlip}
            />
          )
        }
      >
        {shown(singleShown, "single")}
      </NotebookPage>
    </RingNotebook>
  );

  const turner = (target: Layout, className: string) => {
    const spreadCount = Math.ceil(spreadPages.length / 2);
    const position =
      target === "spread"
        ? { page: spreadStart / 2 + 1, total: spreadCount }
        : { page: singleStart + 1, total: singlePages.length };
    return (
      <PageTurner
        label={interpolate(dict.recordDetail.pagePosition, position)}
        prevLabel={dict.recordDetail.prevPage}
        nextLabel={dict.recordDetail.nextPage}
        prev={layout === target && hasPrev ? goPrev : undefined}
        next={layout === target && hasNext ? goNext : undefined}
        className={className}
      />
    );
  };

  return (
    <NotebookScreen
      toolbar={
        <>
          {toolbar}
          {turner("spread", "hidden lg:flex")}
        </>
      }
      footer={turner("single", "justify-center pt-2 pb-4.5 lg:hidden")}
      onPointerDown={swipe.onPointerDown}
      onPointerUp={swipe.onPointerUp}
    >
      {layout === null ? (
        <>
          <div className="hidden lg:block">{spread}</div>
          <div className="h-full lg:hidden">{single}</div>
        </>
      ) : layout === "spread" ? (
        spread
      ) : (
        single
      )}
    </NotebookScreen>
  );
}
