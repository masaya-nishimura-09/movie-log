"use server";

import { redirect } from "next/navigation";
import type { ActionResult } from "@/actions/action-result";
import { deleteArticle } from "@/api/article/delete-article";
import { ApiError } from "@/api/client/api-error";
import type { Locale } from "@/i18n/locales";
import { articleFrom } from "@/lib/article/article-from";

export async function deleteArticleAction(
  lang: Locale,
  recordId: string,
  articleId: string,
  from?: string,
): Promise<ActionResult<never>> {
  try {
    await deleteArticle(articleId);
  } catch (error) {
    const gone =
      error instanceof ApiError && error.code === "ARTICLE_NOT_FOUND";
    if (!gone && error instanceof ApiError) {
      return { success: false, messageKey: "unexpectedError" };
    }
    if (!gone) throw error;
  }
  redirect(articleFrom(from, lang, recordId) ?? `/${lang}/records/${recordId}`);
}
