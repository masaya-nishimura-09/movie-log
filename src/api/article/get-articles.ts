import { apiFetch } from "@/api/client/api-fetch";
import {
  type ArticleList,
  type ArticleQuery,
  type ArticleSort,
  articleListResponseSchema,
} from "@/schemas/article/list";

export const articlePerPage = 12;

const sortParams: Record<ArticleSort, { field: string; order: string }> = {
  updatedAtDesc: { field: "updated_at", order: "desc" },
  updatedAtAsc: { field: "updated_at", order: "asc" },
  createdAtDesc: { field: "created_at", order: "desc" },
  createdAtAsc: { field: "created_at", order: "asc" },
  titleAsc: { field: "title", order: "asc" },
};

function toParams(query: ArticleQuery, perPage: number): URLSearchParams {
  const params = new URLSearchParams();
  if (query.recordId !== undefined) params.set("record_id", query.recordId);
  if (query.keyword !== "") params.set("keyword", query.keyword);
  params.set("sort_field", sortParams[query.sort].field);
  params.set("sort_order", sortParams[query.sort].order);
  params.set("page", String(query.page));
  params.set("per_page", String(perPage));
  return params;
}

export async function getArticles(
  query: ArticleQuery,
  perPage = articlePerPage,
): Promise<ArticleList> {
  const list = await apiFetch(
    `/articles/?${toParams(query, perPage)}`,
    articleListResponseSchema,
  );
  const pageCount = Math.max(1, Math.ceil(list.filteredCount / perPage));
  if (query.page > pageCount) {
    return getArticles({ ...query, page: pageCount }, perPage);
  }
  return {
    articles: list.articles,
    totalCount: list.totalCount,
    filteredCount: list.filteredCount,
    page: query.page,
    pageCount,
  };
}
