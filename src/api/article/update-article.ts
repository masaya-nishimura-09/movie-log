import { apiFetch } from "@/api/client/api-fetch";
import { jsonBody } from "@/api/client/request-json";
import { type Article, articleResponseSchema } from "@/schemas/article/article";
import {
  type ArticleInput,
  toArticleRequest,
} from "@/schemas/article/article-input";

export async function updateArticle(
  articleId: string,
  input: ArticleInput,
): Promise<Article> {
  return apiFetch(
    `/articles/${encodeURIComponent(articleId)}`,
    articleResponseSchema,
    jsonBody(toArticleRequest(input), "PUT"),
  );
}
