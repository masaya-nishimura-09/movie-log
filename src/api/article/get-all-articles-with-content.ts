import { apiFetch } from "@/api/client/api-fetch";
import type { Article } from "@/schemas/article/article";
import { articleContentListResponseSchema } from "@/schemas/article/list";

const perPage = 100;

function fetchPage(page: number) {
  return apiFetch(
    `/articles/?include_content=true&sort_field=created_at&sort_order=asc&page=${page}&per_page=${perPage}`,
    articleContentListResponseSchema,
  );
}

export async function getAllArticlesWithContent(): Promise<Article[]> {
  const first = await fetchPage(1);
  const pageCount = Math.ceil(first.filteredCount / perPage);
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) =>
      fetchPage(i + 2),
    ),
  );
  return [first, ...rest].flatMap((list) => list.articles);
}
