import { apiFetch } from "@/api/client/api-fetch";
import { jsonBody } from "@/api/client/request-json";
import { type Article, articleResponseSchema } from "@/schemas/article/article";
import {
  type ArticleInput,
  toCreateArticleRequest,
} from "@/schemas/article/article-input";

export async function createArticle(
  recordId: string,
  input: ArticleInput,
): Promise<Article> {
  return apiFetch(
    "/articles/",
    articleResponseSchema,
    jsonBody(toCreateArticleRequest(recordId, input)),
  );
}
