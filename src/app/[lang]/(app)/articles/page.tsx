import type { Metadata } from "next";
import Link from "next/link";
import { articlePerPage, getArticles } from "@/api/article/get-articles";
import { getRecordOptions } from "@/api/record/get-record-options";
import { buttonVariants } from "@/components/atoms/button";
import { EmptyState } from "@/components/molecules/empty-state";
import { FilterButton } from "@/components/molecules/filter-button";
import { Pagination } from "@/components/molecules/pagination";
import { SearchForm } from "@/components/molecules/search-form";
import {
  ArticleActiveFilterList,
  ArticleFilterPanel,
  ArticleRecordOptions,
  ArticleSortOptions,
} from "@/components/organisms/article-filter-panel";
import { ArticleList } from "@/components/organisms/article-list";
import { FilterSheet } from "@/components/organisms/filter-sheet";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import {
  articleQueryKeys,
  defaultArticleSort,
  parseArticleQuery,
  toArticleQueryValues,
} from "@/lib/article/parse-article-query";
import { interpolate } from "@/lib/text/interpolate";
import { buildHref } from "@/lib/url/build-href";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.articleList.heading };
}

export default async function ArticlesPage({
  searchParams,
}: PageProps<"/[lang]/articles">) {
  const [lang, dict, params] = await Promise.all([
    getLocale(),
    getDictionary(),
    searchParams,
  ]);
  const query = parseArticleQuery(params);
  const [list, recordOptions] = await Promise.all([
    getArticles(query),
    getRecordOptions(),
  ]);

  const basePath = `/${lang}/articles`;
  const values = toArticleQueryValues(query);
  const clearHref = buildHref(basePath, {
    [articleQueryKeys.sort]: values[articleQueryKeys.sort],
  });
  const activeCount =
    (query.keyword === "" ? 0 : 1) + (query.recordId === undefined ? 0 : 1);
  const pageHref = (page: number) =>
    buildHref(basePath, {
      ...values,
      [articleQueryKeys.page]: page === 1 ? undefined : String(page),
    });
  const selectedRecordTitle = recordOptions.find(
    (r) => r.recordId === query.recordId,
  )?.title;

  const filterProps = { basePath, query, values };
  const panel = (
    <ArticleFilterPanel
      {...filterProps}
      dict={dict.articleList}
      records={recordOptions}
    />
  );
  const search = (
    <SearchForm
      action={basePath}
      name={articleQueryKeys.keyword}
      keyword={query.keyword}
      hidden={{
        [articleQueryKeys.record]: query.recordId,
        [articleQueryKeys.sort]:
          query.sort === defaultArticleSort ? undefined : query.sort,
      }}
      label={dict.articleList.searchLabel}
      placeholder={dict.articleList.searchPlaceholder}
      maxLength={255}
    />
  );

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 pt-5 pb-7 md:px-7 md:pt-6">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-0.75">
          <h1 className="font-bold text-2xl text-foreground">
            {dict.articleList.heading}
          </h1>
          {list.totalCount > 0 && (
            <p className="text-[13px] text-foreground-sub">
              {interpolate(dict.articleList.summary, {
                total: list.totalCount,
                shown: list.filteredCount,
              })}
              {activeCount > 0 &&
                ` ・ ${interpolate(dict.articleList.activeFilters, {
                  count: activeCount,
                })}`}
            </p>
          )}
        </div>
        {list.totalCount > 0 && (
          <div className="md:hidden">
            <FilterSheet
              activeCount={activeCount}
              resultCount={list.filteredCount}
              clearHref={clearHref}
              dict={{
                open: dict.articleList.filterOpen,
                title: dict.articleList.filterTitle,
                clearAll: dict.articleList.clearAll,
                showResults: dict.articleList.showResults,
              }}
            >
              {panel}
            </FilterSheet>
          </div>
        )}
      </div>

      {list.totalCount > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-full md:w-72">{search}</div>
            <div className="hidden flex-wrap items-center gap-2 md:flex">
              <span className="mx-1 h-6 w-px bg-border" aria-hidden />
              <div className="w-48">
                <ArticleSortOptions
                  {...filterProps}
                  dict={dict.articleList.sort}
                  className="bg-control"
                />
              </div>
              <FilterButton
                label={dict.articleList.record}
                selectedLabel={selectedRecordTitle}
                wide
              >
                <ArticleRecordOptions
                  {...filterProps}
                  records={recordOptions}
                  emptyLabel={dict.articleList.noRecords}
                />
              </FilterButton>
            </div>
          </div>
          <ArticleActiveFilterList
            {...filterProps}
            clearHref={clearHref}
            recordTitle={selectedRecordTitle}
            dict={dict.articleList}
          />
        </div>
      )}

      {list.totalCount === 0 ? (
        <div className="flex flex-1 items-start justify-center py-10">
          <EmptyState
            title={dict.articleList.emptyTitle}
            description={dict.articleList.emptyDescription}
            action={
              <Link
                href={`/${lang}/records`}
                className={buttonVariants({ variant: "outline" })}
              >
                {dict.articleList.emptyAction}
              </Link>
            }
          />
        </div>
      ) : list.articles.length === 0 ? (
        <EmptyState
          title={dict.articleList.noMatch}
          action={
            <Link
              href={clearHref}
              className={buttonVariants({ variant: "outline" })}
            >
              {dict.articleList.clearFilters}
            </Link>
          }
        />
      ) : (
        <ArticleList
          lang={lang}
          articles={list.articles}
          startIndex={(list.page - 1) * articlePerPage}
          dict={dict.articleList}
          noPosterLabel={dict.recordCard.noPoster}
          yearTemplate={dict.recordDetail.releaseYear}
          fromHref={buildHref(basePath, values)}
        />
      )}

      {list.pageCount > 1 && (
        <Pagination
          previousHref={list.page > 1 ? pageHref(list.page - 1) : undefined}
          nextHref={
            list.page < list.pageCount ? pageHref(list.page + 1) : undefined
          }
          status={interpolate(dict.pagination.status, {
            current: list.page,
            total: list.pageCount,
          })}
          previousLabel={dict.pagination.previous}
          nextLabel={dict.pagination.next}
        />
      )}
    </div>
  );
}
