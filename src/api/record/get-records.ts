import { apiFetch } from "@/api/client/api-fetch";
import {
  type RecordList,
  type RecordQuery,
  type RecordSort,
  recordListResponseSchema,
} from "@/schemas/record/list";

const perPage = 12;

const sortParams: Record<RecordSort, { field: string; order: string }> = {
  watchedAtDesc: { field: "watched_at", order: "desc" },
  watchedAtAsc: { field: "watched_at", order: "asc" },
  scoreDesc: { field: "score", order: "desc" },
  releaseYearDesc: { field: "release_year", order: "desc" },
  titleAsc: { field: "title", order: "asc" },
};

function toParams(query: RecordQuery): URLSearchParams {
  const params = new URLSearchParams();
  for (const score of query.scores) params.append("scores", String(score));
  for (const platform of query.platforms) params.append("platforms", platform);
  for (const moodTag of query.moodTags) params.append("mood_tags", moodTag);
  for (const genre of query.genres) params.append("genres", genre);
  if (query.keyword !== "") params.set("title", query.keyword);
  params.set("sort_field", sortParams[query.sort].field);
  params.set("sort_order", sortParams[query.sort].order);
  params.set("page", String(query.page));
  params.set("per_page", String(perPage));
  return params;
}

export async function getRecords(query: RecordQuery): Promise<RecordList> {
  const list = await apiFetch(
    `/records/?${toParams(query)}`,
    recordListResponseSchema,
  );
  const pageCount = Math.max(1, Math.ceil(list.filteredCount / perPage));
  if (query.page > pageCount) {
    return getRecords({ ...query, page: pageCount });
  }
  return {
    records: list.records,
    totalCount: list.totalCount,
    filteredCount: list.filteredCount,
    page: query.page,
    pageCount,
  };
}
