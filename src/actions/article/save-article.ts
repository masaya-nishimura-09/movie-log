"use server";

import { redirect } from "next/navigation";
import { type ActionResult, invalidInput } from "@/actions/action-result";
import { createArticle } from "@/api/article/create-article";
import { updateArticle } from "@/api/article/update-article";
import { ApiError } from "@/api/client/api-error";
import type { Locale } from "@/i18n/locales";
import { articleFrom } from "@/lib/article/article-from";
import { readArticleForm } from "@/lib/article/read-article-form";
import { withFrom } from "@/lib/url/back-href";
import { articleInputSchema } from "@/schemas/article/article-input";

type ArticleActionResult = ActionResult<never> | undefined;

async function save(
  lang: Locale,
  target: { recordId: string } | { articleId: string },
  formData: FormData,
  from?: string,
): Promise<ActionResult<never>> {
  const input = articleInputSchema.safeParse(readArticleForm(formData));
  if (!input.success) {
    return invalidInput(input.error);
  }

  let path: string;
  try {
    const article =
      "articleId" in target
        ? await updateArticle(target.articleId, input.data)
        : await createArticle(target.recordId, input.data);
    path = withFrom(
      `/${lang}/records/${article.record.recordId}/articles/${article.articleId}`,
      articleFrom(from, lang, article.record.recordId),
    );
  } catch (error) {
    if (error instanceof ApiError && error.code === "ARTICLE_NOT_FOUND") {
      return { success: false, messageKey: "notFound" };
    }
    if (error instanceof ApiError && error.code === "RECORD_NOT_FOUND") {
      return { success: false, messageKey: "recordNotFound" };
    }
    if (error instanceof ApiError && error.code === "INVALID_INPUT") {
      return { success: false, messageKey: "invalidInput" };
    }
    if (error instanceof ApiError) {
      return { success: false, messageKey: "unexpectedError" };
    }
    throw error;
  }
  redirect(path);
}

export async function createArticleAction(
  lang: Locale,
  recordId: string,
  from: string | undefined,
  _previous: ArticleActionResult,
  formData: FormData,
): Promise<ActionResult<never>> {
  return save(lang, { recordId }, formData, from);
}

export async function updateArticleAction(
  lang: Locale,
  articleId: string,
  from: string | undefined,
  _previous: ArticleActionResult,
  formData: FormData,
): Promise<ActionResult<never>> {
  return save(lang, { articleId }, formData, from);
}
