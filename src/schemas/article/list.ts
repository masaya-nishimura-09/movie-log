import { z } from "zod";
import {
  articleSummaryResponseSchema,
  articleSummarySchema,
} from "@/schemas/article/article";

export const articleSortSchema = z.enum([
  "updatedAtDesc",
  "updatedAtAsc",
  "createdAtDesc",
  "createdAtAsc",
  "titleAsc",
]);

export type ArticleSort = z.infer<typeof articleSortSchema>;

export const articleSorts = articleSortSchema.options;

const articleQuerySchema = z.object({
  recordId: z.string().optional(),
  keyword: z.string(),
  sort: articleSortSchema,
  page: z.number().int().min(1),
});

export type ArticleQuery = z.infer<typeof articleQuerySchema>;

const countSchema = z.number().int().min(0);

export const articleListResponseSchema = z
  .object({
    articles: z.array(articleSummaryResponseSchema),
    filtered_count: countSchema,
    total_count: countSchema,
  })
  .transform((r) => ({
    articles: r.articles,
    filteredCount: r.filtered_count,
    totalCount: r.total_count,
  }));

const articleListSchema = z.object({
  articles: z.array(articleSummarySchema),
  totalCount: countSchema,
  filteredCount: countSchema,
  page: z.number().int().min(1),
  pageCount: z.number().int().min(1),
});

export type ArticleList = z.infer<typeof articleListSchema>;
