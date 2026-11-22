import { Pencil, SearchX } from "lucide-react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { getRecords } from "@/api/record/get-records";
import { buttonVariants } from "@/components/atoms/button";
import { PenIllustration } from "@/components/atoms/pen-illustration";
import { phrases } from "@/components/atoms/phrases";
import { FilterButton } from "@/components/molecules/filter-button";
import { PageTurner } from "@/components/molecules/page-turner";
import { TocHeader } from "@/components/molecules/toc-header";
import { ActiveFilterList } from "@/components/organisms/active-filter-list";
import { FilterSheet } from "@/components/organisms/filter-sheet";
import { NotebookScreen } from "@/components/organisms/notebook-screen";
import {
  GenreOptions,
  MoodOptions,
  PlatformOptions,
  RecordFilterPanel,
  ScoreOptions,
  SortOptions,
} from "@/components/organisms/record-filter-panel";
import { RecordToc } from "@/components/organisms/record-toc";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { timeZoneCookie, validTimeZone } from "@/lib/date/time-zone";
import {
  parseRecordQuery,
  recordQueryKeys,
  toQueryValues,
} from "@/lib/record/parse-record-query";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";
import { buildHref } from "@/lib/url/build-href";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.recordList.heading };
}

export default async function RecordsPage({
  searchParams,
}: PageProps<"/[lang]/records">) {
  const [lang, dict, params, cookieStore] = await Promise.all([
    getLocale(),
    getDictionary(),
    searchParams,
    cookies(),
  ]);
  const timeZone =
    validTimeZone(cookieStore.get(timeZoneCookie)?.value) ?? "UTC";
  const query = parseRecordQuery(params);
  const list = await getRecords(query);
  const values = toQueryValues(query);
  const basePath = `/${lang}/records`;
  const l = dict.recordList;
  const clearHref = buildHref(basePath, {
    [recordQueryKeys.sort]: values[recordQueryKeys.sort],
  });
  const activeCount =
    (query.score === undefined ? 0 : 1) +
    (query.platform === undefined ? 0 : 1) +
    query.moodTags.length +
    query.genres.length +
    (query.keyword === "" ? 0 : 1);
  const listHref = buildHref(basePath, values);
  const pageHref = (page: number) =>
    buildHref(basePath, {
      ...values,
      [recordQueryKeys.page]: page === 1 ? undefined : String(page),
    });
  const prevHref = list.page > 1 ? pageHref(list.page - 1) : undefined;
  const nextHref =
    list.page < list.pageCount ? pageHref(list.page + 1) : undefined;
  const hasRecords = list.totalCount > 0;

  const filterProps = { basePath, query, values, enums: dict.enums };
  const filterDict = dict.recordFilter;

  const empty = !hasRecords ? (
    <div className="flex h-112 flex-col items-center justify-center gap-3 text-center">
      <p className="font-bold font-display text-xl">
        {phrases(dict.emptyState.title)}
      </p>
      <p className="max-w-40 text-[13px] text-paper-muted leading-5.5">
        {phrases(dict.emptyState.description)}
      </p>
      <Link
        href={`${basePath}/new`}
        className={cn(buttonVariants({ size: "sm" }), "mt-2 px-4")}
      >
        <Pencil aria-hidden />
        {dict.emptyState.action}
      </Link>
      <PenIllustration className="mt-4.5" />
    </div>
  ) : list.records.length === 0 ? (
    <div className="flex h-70 flex-col items-center justify-center gap-2.5 text-center">
      <SearchX className="size-9 text-primary" strokeWidth={1.5} aria-hidden />
      <p className="font-bold font-display text-[17px]">{phrases(l.noMatch)}</p>
      <p className="text-[13px] text-paper-muted">{phrases(l.noMatchHint)}</p>
      <Link
        href={clearHref}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "mt-1.5 h-9.5 text-[13px] text-paper-ink shadow-[inset_0_0_0_1px_rgb(10_41_71/0.22)] hover:bg-[rgb(10_41_71/0.06)]",
        )}
      >
        {l.clearFilters}
      </Link>
    </div>
  ) : null;

  const turnerLabel = interpolate(dict.recordDetail.pagePosition, {
    page: list.page,
    total: list.pageCount,
  });

  return (
    <NotebookScreen
      grow
      toolbar={
        <div
          inert={!hasRecords}
          className={cn(
            "flex flex-1 flex-wrap items-center gap-1.5 lg:gap-3",
            !hasRecords && "opacity-50",
          )}
        >
          <SortOptions
            {...filterProps}
            sortDict={dict.recordSort}
            className="h-9 w-auto gap-1.5 rounded-[10px] bg-transparent px-3 font-medium text-foreground shadow-[inset_0_0_0_1px_var(--outline)]"
          />
          <div className="ml-1.5 hidden flex-wrap items-center gap-2 lg:flex">
            <FilterButton
              label={filterDict.score}
              selectedLabel={
                query.score === undefined ? undefined : `★${query.score}`
              }
              selectedTemplate={filterDict.selected}
            >
              <ScoreOptions {...filterProps} />
            </FilterButton>
            <FilterButton
              label={filterDict.platform}
              selectedLabel={
                query.platform === undefined
                  ? undefined
                  : dict.enums.platform[query.platform]
              }
              selectedTemplate={filterDict.selected}
              wide
            >
              <PlatformOptions {...filterProps} />
            </FilterButton>
            <FilterButton
              label={filterDict.moodTag}
              count={query.moodTags.length}
              selectedTemplate={filterDict.selected}
              wide
            >
              <MoodOptions {...filterProps} />
            </FilterButton>
            <FilterButton
              label={filterDict.genre}
              count={query.genres.length}
              selectedTemplate={filterDict.selected}
              wide
            >
              <GenreOptions {...filterProps} />
            </FilterButton>
          </div>
          <div className="flex-1" />
          <div className="lg:hidden">
            <FilterSheet
              activeCount={activeCount}
              resultCount={list.filteredCount}
              clearHref={clearHref}
              closeLabel={dict.header.close}
              dict={filterDict}
            >
              <RecordFilterPanel
                {...filterProps}
                dict={filterDict}
                sortDict={dict.recordSort}
              />
            </FilterSheet>
          </div>
          <PageTurner
            label={turnerLabel}
            prevLabel={dict.recordDetail.prevPage}
            nextLabel={dict.recordDetail.nextPage}
            prev={prevHref}
            next={nextHref}
            className="hidden lg:flex"
          />
        </div>
      }
      footer={
        <PageTurner
          label={turnerLabel}
          prevLabel={dict.recordDetail.prevPage}
          nextLabel={dict.recordDetail.nextPage}
          prev={prevHref}
          next={nextHref}
          className="justify-center pt-2 pb-4.5 lg:hidden"
        />
      }
    >
      <RecordToc
        lang={lang}
        records={list.records}
        sort={query.sort}
        initialTimeZone={timeZone}
        header={
          <TocHeader
            label={l.contents}
            title={l.heading}
            summary={
              activeCount > 0
                ? interpolate(l.filteredSummary, {
                    total: list.totalCount,
                    shown: list.filteredCount,
                  })
                : interpolate(l.summary, { total: list.totalCount })
            }
          />
        }
        filterBar={
          activeCount > 0 && (
            <ActiveFilterList
              label={l.filtering}
              count={interpolate(l.resultCount, {
                count: list.filteredCount,
              })}
              basePath={basePath}
              query={query}
              values={values}
              clearHref={clearHref}
              dict={filterDict}
              enums={dict.enums}
            />
          )
        }
        emptyContent={empty}
        pageNumbers={[list.page * 2 - 1, list.page * 2]}
        mobilePageNumber={list.page}
        href={pageHref(list.page)}
        prevHref={prevHref}
        nextHref={nextHref}
        fromHref={listHref === basePath ? undefined : listHref}
        dict={dict}
      />
    </NotebookScreen>
  );
}
