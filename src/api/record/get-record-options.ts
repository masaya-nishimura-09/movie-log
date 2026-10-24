import { cache } from "react";
import { apiFetch } from "@/api/client/api-fetch";
import {
  type RecordOption,
  recordListResponseSchema,
} from "@/schemas/record/list";

const perPage = 100;

function fetchPage(page: number) {
  return apiFetch(
    `/records/?sort_field=title&sort_order=asc&page=${page}&per_page=${perPage}`,
    recordListResponseSchema,
  );
}

export const getRecordOptions = cache(
  async function getRecordOptions(): Promise<RecordOption[]> {
    const first = await fetchPage(1);
    const pageCount = Math.ceil(first.filteredCount / perPage);
    const rest = await Promise.all(
      Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) =>
        fetchPage(i + 2),
      ),
    );
    return [first, ...rest]
      .flatMap((list) => list.records)
      .map(({ recordId, title, releaseYear }) => ({
        recordId,
        title,
        releaseYear,
      }));
  },
);
