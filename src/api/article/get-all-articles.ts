import { cache } from "react";
import { getArticles } from "@/api/article/get-articles";
import type { ArticleSummary } from "@/schemas/article/article";

const perPage = 100;

export const getAllArticles = cache(async function getAllArticles(): Promise<
  ArticleSummary[]
> {
  const query = { keyword: "", sort: "updatedAtDesc", page: 1 } as const;
  const first = await getArticles(query, perPage);
  const rest = await Promise.all(
    Array.from({ length: first.pageCount - 1 }, (_, i) =>
      getArticles({ ...query, page: i + 2 }, perPage),
    ),
  );
  return [first, ...rest].flatMap((list) => list.articles);
});
