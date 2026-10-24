import { z } from "zod";
import type { QueryValues } from "@/lib/url/build-href";
import { isResourceId } from "@/lib/url/resource-id";
import { type ArticleQuery, articleSortSchema } from "@/schemas/article/list";

type SearchParams = Record<string, string | string[] | undefined>;

export const articleQueryKeys = {
  keyword: "keyword",
  record: "record",
  sort: "sort",
  page: "page",
} as const;

export const defaultArticleSort = "updatedAtDesc";

const keywordMaxLength = 255;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseArticleQuery(params: SearchParams): ArticleQuery {
  const keyword = (first(params[articleQueryKeys.keyword]) ?? "")
    .trim()
    .slice(0, keywordMaxLength);
  const record = first(params[articleQueryKeys.record]);
  const sort = articleSortSchema.safeParse(
    first(params[articleQueryKeys.sort]),
  );
  const page = z.coerce
    .number()
    .int()
    .min(1)
    .safeParse(first(params[articleQueryKeys.page]));

  return {
    recordId: record !== undefined && isResourceId(record) ? record : undefined,
    keyword,
    sort: sort.success ? sort.data : defaultArticleSort,
    page: page.success ? page.data : 1,
  };
}

export function toArticleQueryValues(query: ArticleQuery): QueryValues {
  return {
    [articleQueryKeys.keyword]: query.keyword,
    [articleQueryKeys.record]: query.recordId,
    [articleQueryKeys.sort]:
      query.sort === defaultArticleSort ? undefined : query.sort,
    [articleQueryKeys.page]: query.page === 1 ? undefined : String(query.page),
  };
}
