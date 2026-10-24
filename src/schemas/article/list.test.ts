import { describe, expect, it } from "vitest";
import {
  articleListResponseSchema,
  articleSortSchema,
  articleSorts,
} from "@/schemas/article/list";

const record = {
  record_id: "2",
  title: "勝手にしやがれ",
  release_year: 1960,
  poster_url: "https://example.com/poster.jpg",
};

const item = {
  article_id: "1",
  record,
  title: "感想",
  created_at: "2026-10-01T12:00:00Z",
  updated_at: "2026-10-02T12:00:00Z",
};

describe("articleListResponseSchema", () => {
  it("converts the API response to camelCase, keeping the order and the counts", () => {
    const list = articleListResponseSchema.parse({
      articles: [item, { ...item, article_id: "3", title: "二つ目" }],
      filtered_count: 2,
      total_count: 5,
    });
    expect(list).toEqual({
      articles: [
        {
          articleId: "1",
          record: {
            recordId: "2",
            title: "勝手にしやがれ",
            releaseYear: 1960,
            posterUrl: "https://example.com/poster.jpg",
          },
          title: "感想",
          createdAt: "2026-10-01T12:00:00Z",
          updatedAt: "2026-10-02T12:00:00Z",
        },
        expect.objectContaining({ articleId: "3", title: "二つ目" }),
      ],
      filteredCount: 2,
      totalCount: 5,
    });
  });

  it("accepts an empty list", () => {
    expect(
      articleListResponseSchema.parse({
        articles: [],
        filtered_count: 0,
        total_count: 0,
      }),
    ).toEqual({ articles: [], filteredCount: 0, totalCount: 0 });
  });

  it("rejects a response without the counts", () => {
    expect(articleListResponseSchema.safeParse({ articles: [] }).success).toBe(
      false,
    );
  });

  it("rejects a negative or fractional count", () => {
    for (const count of [-1, 1.5]) {
      expect(
        articleListResponseSchema.safeParse({
          articles: [],
          filtered_count: count,
          total_count: 0,
        }).success,
      ).toBe(false);
    }
  });
});

describe("articleSortSchema", () => {
  it("lists the five sorts, newest update first", () => {
    expect(articleSorts).toEqual([
      "updatedAtDesc",
      "updatedAtAsc",
      "createdAtDesc",
      "createdAtAsc",
      "titleAsc",
    ]);
  });

  it("rejects an unknown sort", () => {
    expect(articleSortSchema.safeParse("scoreDesc").success).toBe(false);
  });
});
