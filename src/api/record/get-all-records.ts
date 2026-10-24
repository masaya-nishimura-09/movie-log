import { cache } from "react";
import { apiFetch } from "@/api/client/api-fetch";
import { recordListResponseSchema } from "@/schemas/record/list";
import type { MovieRecord } from "@/schemas/record/record";

const perPage = 100;

type SortField = "title" | "watched_at";
type SortOrder = "asc" | "desc";

function fetchPage(field: SortField, order: SortOrder, page: number) {
  return apiFetch(
    `/records/?sort_field=${field}&sort_order=${order}&page=${page}&per_page=${perPage}`,
    recordListResponseSchema,
  );
}

export const getAllRecords = cache(async function getAllRecords(
  field: SortField,
  order: SortOrder,
): Promise<MovieRecord[]> {
  const first = await fetchPage(field, order, 1);
  const pageCount = Math.ceil(first.filteredCount / perPage);
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) =>
      fetchPage(field, order, i + 2),
    ),
  );
  return [first, ...rest].flatMap((list) => list.records);
});
