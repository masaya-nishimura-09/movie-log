"use server";

import type { ActionResult } from "@/actions/action-result";
import { getAllArticlesWithContent } from "@/api/article/get-all-articles-with-content";
import { ApiError } from "@/api/client/api-error";
import type { Article } from "@/schemas/article/article";

export async function exportArticlesAction(): Promise<ActionResult<Article[]>> {
  try {
    return { success: true, data: await getAllArticlesWithContent() };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, messageKey: "exportFailed" };
    }
    throw error;
  }
}
