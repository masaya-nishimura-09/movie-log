import type { JSONContent } from "@tiptap/react";
import { z } from "zod";

export const articleContentSchema = z.custom<JSONContent>(
  (value) =>
    typeof value === "object" && value !== null && !Array.isArray(value),
);

const articleRecordSchema = z.object({
  recordId: z.string(),
  title: z.string(),
  releaseYear: z.number().int().min(0),
  posterUrl: z.string(),
});

export type ArticleRecord = z.infer<typeof articleRecordSchema>;

const articleRecordResponseSchema = z
  .object({
    record_id: z.string(),
    title: z.string(),
    release_year: z.number().int().min(0),
    poster_url: z.string(),
  })
  .transform(
    (r): ArticleRecord => ({
      recordId: r.record_id,
      title: r.title,
      releaseYear: r.release_year,
      posterUrl: r.poster_url,
    }),
  );

const articleSchema = z.object({
  articleId: z.string(),
  record: articleRecordSchema,
  title: z.string(),
  content: articleContentSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Article = z.infer<typeof articleSchema>;

export const articleResponseSchema = z
  .object({
    article_id: z.string(),
    record: articleRecordResponseSchema,
    title: z.string(),
    content: articleContentSchema,
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
  })
  .transform(
    (a): Article => ({
      articleId: a.article_id,
      record: a.record,
      title: a.title,
      content: a.content,
      createdAt: a.created_at,
      updatedAt: a.updated_at,
    }),
  );

export type ArticleResponse = z.input<typeof articleResponseSchema>;

export const articleSummarySchema = articleSchema.omit({ content: true });

export type ArticleSummary = z.infer<typeof articleSummarySchema>;

export const articleSummaryResponseSchema = z
  .object({
    article_id: z.string(),
    record: articleRecordResponseSchema,
    title: z.string(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
  })
  .transform(
    (a): ArticleSummary => ({
      articleId: a.article_id,
      record: a.record,
      title: a.title,
      createdAt: a.created_at,
      updatedAt: a.updated_at,
    }),
  );

export type ArticleSummaryResponse = z.input<
  typeof articleSummaryResponseSchema
>;
