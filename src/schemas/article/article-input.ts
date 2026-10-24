import type { JSONContent } from "@tiptap/react";
import { z } from "zod";
import { articleContentSchema } from "@/schemas/article/article";

const contentMaxBytes = 100 * 1024;

export const contentRequiredMessage = "required";

function hasText(node: JSONContent): boolean {
  return (node.text ?? "").trim() !== "" || (node.content ?? []).some(hasText);
}

export const articleInputSchema = z.object({
  title: z.string().min(1).max(255),
  content: articleContentSchema
    .refine((content) => content.type === "doc", { abort: true })
    .refine(hasText, { message: contentRequiredMessage })
    .refine(
      (content) =>
        new TextEncoder().encode(JSON.stringify(content)).length <=
        contentMaxBytes,
    ),
});

export type ArticleInput = z.infer<typeof articleInputSchema>;

export function toArticleRequest(input: ArticleInput) {
  return {
    title: input.title,
    content: input.content,
  };
}

export function toCreateArticleRequest(recordId: string, input: ArticleInput) {
  return { record_id: recordId, ...toArticleRequest(input) };
}
