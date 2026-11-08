import { apiFetch } from "@/api/client/api-fetch";
import { recordNoteListResponseSchema } from "@/schemas/record/list";
import type { RecordDetail } from "@/schemas/record/record";

const perPage = 100;

function fetchPage(page: number) {
  return apiFetch(
    `/records/?include_note=true&sort_field=watched_at&sort_order=asc&page=${page}&per_page=${perPage}`,
    recordNoteListResponseSchema,
  );
}

export async function getAllRecordsWithNotes(): Promise<RecordDetail[]> {
  const first = await fetchPage(1);
  const pageCount = Math.ceil(first.filteredCount / perPage);
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) =>
      fetchPage(i + 2),
    ),
  );
  return [first, ...rest].flatMap((list) => list.records);
}
