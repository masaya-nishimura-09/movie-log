import { cache } from "react";
import { getArticles } from "@/api/article/get-articles";
import { isResourceId } from "@/lib/url/resource-id";
import type { ArticleSummary } from "@/schemas/article/article";

export const recordArticlePreviewCount = 3;

type RecordArticles = {
  articles: ArticleSummary[];
  total: number;
};

export const getRecordArticles = cache(async function getRecordArticles(
  recordId: string,
): Promise<RecordArticles> {
  if (!isResourceId(recordId)) return { articles: [], total: 0 };
  const list = await getArticles(
    { recordId, keyword: "", sort: "updatedAtDesc", page: 1 },
    recordArticlePreviewCount,
  );
  return { articles: list.articles, total: list.filteredCount };
});
