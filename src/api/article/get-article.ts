import { cache } from "react";
import { ApiError } from "@/api/client/api-error";
import { apiFetch } from "@/api/client/api-fetch";
import { isResourceId } from "@/lib/url/resource-id";
import { type Article, articleResponseSchema } from "@/schemas/article/article";

export const getArticle = cache(async function getArticle(
  articleId: string,
): Promise<Article | undefined> {
  if (!isResourceId(articleId)) return undefined;
  try {
    return await apiFetch(
      `/articles/${encodeURIComponent(articleId)}`,
      articleResponseSchema,
    );
  } catch (error) {
    if (error instanceof ApiError && error.code === "ARTICLE_NOT_FOUND") {
      return undefined;
    }
    throw error;
  }
});
