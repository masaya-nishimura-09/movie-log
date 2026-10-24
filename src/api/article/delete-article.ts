import { z } from "zod";
import { apiFetch } from "@/api/client/api-fetch";

export async function deleteArticle(articleId: string): Promise<void> {
  await apiFetch(`/articles/${encodeURIComponent(articleId)}`, z.unknown(), {
    method: "DELETE",
  });
}
