import { Plus } from "lucide-react";
import Link from "next/link";
import { getRecords } from "@/api/record/get-records";
import { buttonVariants } from "@/components/atoms/button";
import { EmptyState } from "@/components/molecules/empty-state";
import { Pagination } from "@/components/molecules/pagination";
import { ActiveFilterList } from "@/components/organisms/active-filter-list";
import { FilterButton } from "@/components/organisms/record-filter-bar";
import {
  GenreOptions,
  MoodOptions,
  PlatformOptions,
  RecordFilterPanel,
  ScoreOptions,
  SortOptions,
} from "@/components/organisms/record-filter-panel";
import { RecordFilterSheet } from "@/components/organisms/record-filter-sheet";
import { RecordGrid } from "@/components/organisms/record-grid";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import {
  parseRecordQuery,
  recordQueryKeys,
  toQueryValues,
} from "@/lib/record/parse-record-query";
import { interpolate } from "@/lib/text/interpolate";
import { buildHref } from "@/lib/url/build-href";

export default async function RecordsPage({
  searchParams,
}: PageProps<"/[lang]/records">) {
  const [lang, dict, params] = await Promise.all([
    getLocale(),
    getDictionary(),
    searchParams,
  ]);
  const query = parseRecordQuery(params);
  const list = await getRecords(query);
  const values = toQueryValues(query);
  const basePath = `/${lang}/records`;
  const clearHref = buildHref(basePath, {
    [recordQueryKeys.sort]: values[recordQueryKeys.sort],
  });
  const activeCount =
    query.scores.length +
    query.platforms.length +
    query.moodTags.length +
    query.genres.length +
    (query.keyword === "" ? 0 : 1);
  const pageHref = (page: number) =>
    buildHref(basePath, {
      ...values,
      [recordQueryKeys.page]: page === 1 ? undefined : String(page),
    });

  const filterProps = { basePath, query, values, enums: dict.enums };
  const panel = (
    <RecordFilterPanel
      {...filterProps}
      dict={dict.recordFilter}
      sortDict={dict.recordSort}
    />
  );

  return (
    <main className="flex flex-1 flex-col gap-5 px-4 pt-5 pb-7 md:px-7 md:pt-6">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-0.75">
          <h1 className="font-bold text-2xl text-foreground">
            {dict.recordList.heading}
          </h1>
          {list.totalCount > 0 && (
            <p className="text-[13px] text-foreground-sub">
              {interpolate(dict.recordList.summary, {
                total: list.totalCount,
                shown: list.filteredCount,
              })}
              {activeCount > 0 &&
                ` ・ ${interpolate(dict.recordList.activeFilters, {
                  count: activeCount,
                })}`}
            </p>
          )}
        </div>
        {list.totalCount > 0 && (
          <div className="md:hidden">
            <RecordFilterSheet
              activeCount={activeCount}
              resultCount={list.filteredCount}
              clearHref={clearHref}
              dict={dict.recordFilter}
            >
              {panel}
            </RecordFilterSheet>
          </div>
        )}
      </div>

      {list.totalCount > 0 && (
        <div className="hidden flex-col gap-3 md:flex">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-48">
              <SortOptions {...filterProps} sortDict={dict.recordSort} />
            </div>
            <span className="mx-1 h-6 w-px bg-border" aria-hidden />
            <FilterButton
              label={dict.recordFilter.score}
              count={query.scores.length}
            >
              <ScoreOptions {...filterProps} />
            </FilterButton>
            <FilterButton
              label={dict.recordFilter.platform}
              count={query.platforms.length}
              wide
            >
              <PlatformOptions {...filterProps} />
            </FilterButton>
            <FilterButton
              label={dict.recordFilter.moodTag}
              count={query.moodTags.length}
              wide
            >
              <MoodOptions {...filterProps} />
            </FilterButton>
            <FilterButton
              label={dict.recordFilter.genre}
              count={query.genres.length}
              wide
            >
              <GenreOptions {...filterProps} />
            </FilterButton>
          </div>
          <ActiveFilterList
            basePath={basePath}
            query={query}
            values={values}
            clearHref={clearHref}
            dict={dict.recordFilter}
            enums={dict.enums}
          />
        </div>
      )}

      {list.totalCount === 0 ? (
        <div className="flex flex-1 items-start justify-center py-10">
          <EmptyState
            title={dict.emptyState.title}
            description={dict.emptyState.description}
            action={
              <Link href={`${basePath}/new`} className={buttonVariants()}>
                <Plus aria-hidden />
                {dict.emptyState.action}
              </Link>
            }
          />
        </div>
      ) : list.records.length === 0 ? (
        <EmptyState
          title={dict.recordList.noMatch}
          action={
            <Link
              href={clearHref}
              className={buttonVariants({ variant: "outline" })}
            >
              {dict.recordList.clearFilters}
            </Link>
          }
        />
      ) : (
        <RecordGrid lang={lang} records={list.records} dict={dict} />
      )}

      {list.pageCount > 1 && (
        <Pagination
          previousHref={list.page > 1 ? pageHref(list.page - 1) : undefined}
          nextHref={
            list.page < list.pageCount ? pageHref(list.page + 1) : undefined
          }
          status={interpolate(dict.recordList.pageStatus, {
            current: list.page,
            total: list.pageCount,
          })}
          previousLabel={dict.recordList.previousPage}
          nextLabel={dict.recordList.nextPage}
        />
      )}
    </main>
  );
}
