import { apiFetch } from "@/api/client/api-fetch";
import {
  type RecordList,
  type RecordQuery,
  type RecordSort,
  recordListResponseSchema,
} from "@/schemas/record/list";

const perPage = 100;

const sortParams: Record<RecordSort, { field: string; order: string }> = {
  watchedAtDesc: { field: "watched_at", order: "desc" },
  watchedAtAsc: { field: "watched_at", order: "asc" },
  scoreDesc: { field: "score", order: "desc" },
  releaseYearDesc: { field: "release_year", order: "desc" },
  titleAsc: { field: "title", order: "asc" },
};

function toParams(query: RecordQuery, page: number): URLSearchParams {
  const params = new URLSearchParams();
  if (query.score !== undefined) params.set("score", String(query.score));
  if (query.platform !== undefined) params.set("platform", query.platform);
  for (const moodTag of query.moodTags) params.append("mood_tags", moodTag);
  for (const genre of query.genres) params.append("genres", genre);
  if (query.keyword !== "") params.set("keyword", query.keyword);
  params.set("sort_field", sortParams[query.sort].field);
  params.set("sort_order", sortParams[query.sort].order);
  params.set("page", String(page));
  params.set("per_page", String(perPage));
  return params;
}

function fetchPage(query: RecordQuery, page: number) {
  return apiFetch(
    `/records/?${toParams(query, page)}`,
    recordListResponseSchema,
  );
}

export async function getRecords(query: RecordQuery): Promise<RecordList> {
  const first = await fetchPage(query, 1);
  const pageCount = Math.ceil(first.filteredCount / perPage);
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) =>
      fetchPage(query, index + 2),
    ),
  );
  return {
    records: [first, ...rest].flatMap((list) => list.records),
    totalCount: first.totalCount,
    filteredCount: first.filteredCount,
  };
}
