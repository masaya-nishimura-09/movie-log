import { ActiveFilterChips } from "@/components/molecules/active-filter-chips";
import { FilterRadioLink } from "@/components/molecules/filter-radio-link";
import { FilterSection } from "@/components/molecules/filter-section";
import { SortSelect } from "@/components/molecules/sort-select";
import type { Dictionary } from "@/i18n/get-dictionary";
import {
  articleQueryKeys,
  defaultArticleSort,
} from "@/lib/article/parse-article-query";
import { buildHref, type QueryValues, selectValue } from "@/lib/url/build-href";
import { type ArticleQuery, articleSorts } from "@/schemas/article/list";
import type { RecordOption } from "@/schemas/record/list";

type FilterOptionsProps = {
  basePath: string;
  query: ArticleQuery;
  values: QueryValues;
};

export function ArticleSortOptions({
  basePath,
  query,
  values,
  dict,
  className,
}: FilterOptionsProps & {
  dict: Dictionary["articleList"]["sort"];
  className?: string;
}) {
  return (
    <SortSelect
      className={className}
      label={dict.label}
      value={query.sort}
      options={articleSorts.map((sort) => ({
        value: sort,
        label: dict[sort],
        href: buildHref(basePath, {
          ...values,
          [articleQueryKeys.sort]:
            sort === defaultArticleSort ? undefined : sort,
          [articleQueryKeys.page]: undefined,
        }),
      }))}
    />
  );
}

export function ArticleRecordOptions({
  basePath,
  query,
  values,
  records,
  emptyLabel,
}: FilterOptionsProps & { records: RecordOption[]; emptyLabel: string }) {
  if (records.length === 0) {
    return <p className="text-muted-foreground text-xs">{emptyLabel}</p>;
  }
  return (
    <div role="radiogroup" className="flex flex-col gap-2">
      {records.map((record) => (
        <FilterRadioLink
          key={record.recordId}
          href={buildHref(
            basePath,
            selectValue(values, articleQueryKeys.record, record.recordId),
          )}
          active={query.recordId === record.recordId}
          label={record.title}
        />
      ))}
    </div>
  );
}

export function ArticleFilterPanel({
  dict,
  records,
  ...props
}: FilterOptionsProps & {
  dict: Dictionary["articleList"];
  records: RecordOption[];
}) {
  return (
    <div className="flex flex-col gap-8">
      <FilterSection title={dict.sort.label}>
        <ArticleSortOptions {...props} dict={dict.sort} />
      </FilterSection>
      <FilterSection title={dict.record}>
        <ArticleRecordOptions
          {...props}
          records={records}
          emptyLabel={dict.noRecords}
        />
      </FilterSection>
    </div>
  );
}

export function ArticleActiveFilterList({
  basePath,
  query,
  values,
  clearHref,
  recordTitle,
  dict,
}: FilterOptionsProps & {
  clearHref: string;
  recordTitle: string | undefined;
  dict: Dictionary["articleList"];
}) {
  const items = [
    ...(query.keyword === ""
      ? []
      : [
          {
            label: `"${query.keyword}"`,
            href: buildHref(basePath, {
              ...values,
              [articleQueryKeys.keyword]: undefined,
              [articleQueryKeys.page]: undefined,
            }),
          },
        ]),
    ...(query.recordId === undefined
      ? []
      : [
          {
            label: recordTitle ?? dict.unknownRecord,
            href: buildHref(
              basePath,
              selectValue(values, articleQueryKeys.record, query.recordId),
            ),
          },
        ]),
  ];

  return (
    <ActiveFilterChips
      items={items}
      clearHref={clearHref}
      removeTemplate={dict.remove}
      clearAllLabel={dict.clearAll}
    />
  );
}
