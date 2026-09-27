import { Plus } from "lucide-react";
import Link from "next/link";
import { getRecords } from "@/api/record/get-records";
import { getCurrentUser } from "@/api/user/get-current-user";
import { buttonVariants } from "@/components/atoms/button";
import { EmptyState } from "@/components/molecules/empty-state";
import { Pagination } from "@/components/molecules/pagination";
import { ActiveFilterList } from "@/components/organisms/active-filter-list";
import { RecordFilterPanel } from "@/components/organisms/record-filter-panel";
import { RecordFilterSheet } from "@/components/organisms/record-filter-sheet";
import { RecordGrid } from "@/components/organisms/record-grid";
import { SiteHeader } from "@/components/organisms/site-header";
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
  const [lang, dict, user, params] = await Promise.all([
    getLocale(),
    getDictionary(),
    getCurrentUser(),
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

  const panel = (
    <RecordFilterPanel
      basePath={basePath}
      query={query}
      values={values}
      facets={list.facets}
      dict={dict.recordFilter}
      sortDict={dict.recordSort}
      enums={dict.enums}
    />
  );

  return (
    <>
      <SiteHeader
        lang={lang}
        brandName={dict.brand.name}
        username={user.username}
        keyword={query.keyword}
        dict={dict.header}
        mobileActions={
          list.totalCount > 0 && (
            <RecordFilterSheet
              activeCount={activeCount}
              resultCount={list.filteredCount}
              clearHref={clearHref}
              dict={dict.recordFilter}
            >
              {panel}
            </RecordFilterSheet>
          )
        }
      />

      {list.totalCount === 0 ? (
        <main className="flex flex-1 items-start justify-center px-4 py-10">
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
        </main>
      ) : (
        <div className="flex flex-1">
          <aside className="hidden w-58 shrink-0 border-input border-r bg-card md:block">
            <div className="sticky top-15 px-4.5 py-5.5">{panel}</div>
          </aside>

          <main className="flex min-w-0 flex-1 flex-col gap-5 px-4 pt-5 pb-7 md:px-6">
            <div className="flex items-end justify-between gap-4">
              <div className="flex flex-col gap-0.75">
                <h1 className="font-bold text-2xl text-foreground">
                  {dict.recordList.heading}
                </h1>
                <p className="hidden text-[13px] text-foreground-sub md:block">
                  {interpolate(dict.recordList.summary, {
                    total: list.totalCount,
                    shown: list.filteredCount,
                  })}
                  {activeCount > 0 &&
                    ` ・ ${interpolate(dict.recordList.activeFilters, {
                      count: activeCount,
                    })}`}
                </p>
              </div>
              <p className="pb-1 text-[13px] text-foreground-sub md:hidden">
                {interpolate(dict.recordList.summaryShort, {
                  total: list.totalCount,
                  shown: list.filteredCount,
                })}
              </p>
              <div className="hidden md:block">
                <ActiveFilterList
                  basePath={basePath}
                  query={query}
                  values={values}
                  clearHref={clearHref}
                  dict={dict.recordFilter}
                  enums={dict.enums}
                />
              </div>
            </div>

            {list.records.length === 0 ? (
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
              <RecordGrid
                lang={lang}
                records={list.records}
                groupedByMonth={query.sort.startsWith("watchedAt")}
                dict={dict}
              />
            )}

            {list.pageCount > 1 && (
              <Pagination
                previousHref={
                  list.page > 1 ? pageHref(list.page - 1) : undefined
                }
                nextHref={
                  list.page < list.pageCount
                    ? pageHref(list.page + 1)
                    : undefined
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
        </div>
      )}
    </>
  );
}
