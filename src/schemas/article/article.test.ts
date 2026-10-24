import { describe, expect, it } from "vitest";
import {
  articleResponseSchema,
  articleSummaryResponseSchema,
} from "@/schemas/article/article";

const content = {
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text: "本文" }] }],
};

const record = {
  record_id: "2",
  title: "勝手にしやがれ",
  release_year: 1960,
  poster_url: "https://example.com/poster.jpg",
};

const base = {
  article_id: "1",
  record,
  title: "感想",
  created_at: "2026-10-01T12:00:00Z",
  updated_at: "2026-10-02T12:00:00Z",
};

const camelRecord = {
  recordId: "2",
  title: "勝手にしやがれ",
  releaseYear: 1960,
  posterUrl: "https://example.com/poster.jpg",
};

describe("articleResponseSchema", () => {
  it("converts the API response to camelCase, keeps the content as is and converts the record", () => {
    expect(articleResponseSchema.parse({ ...base, content })).toEqual({
      articleId: "1",
      record: camelRecord,
      title: "感想",
      content,
      createdAt: "2026-10-01T12:00:00Z",
      updatedAt: "2026-10-02T12:00:00Z",
    });
  });

  it("does not take a record_id at the top level", () => {
    const { record: _record, ...rest } = base;
    expect(
      articleResponseSchema.safeParse({ ...rest, record_id: "2", content })
        .success,
    ).toBe(false);
  });

  it("accepts a record without a poster and with an unknown release year", () => {
    const parsed = articleResponseSchema.parse({
      ...base,
      record: { ...record, poster_url: "", release_year: 0 },
      content,
    });
    expect(parsed.record).toMatchObject({ posterUrl: "", releaseYear: 0 });
  });

  it("rejects a record that lacks a field or has a wrong type", () => {
    for (const bad of [
      { ...record, title: undefined },
      { ...record, poster_url: undefined },
      { ...record, release_year: "1960" },
      { ...record, release_year: -1 },
      { ...record, release_year: 1960.5 },
      null,
      "2",
    ]) {
      expect(
        articleResponseSchema.safeParse({ ...base, record: bad, content })
          .success,
      ).toBe(false);
    }
  });

  it("rejects a content that is not an object", () => {
    for (const bad of ["text", [], null]) {
      expect(
        articleResponseSchema.safeParse({ ...base, content: bad }).success,
      ).toBe(false);
    }
  });
});

describe("articleSummaryResponseSchema", () => {
  it("converts the API response to camelCase with the record and without a content", () => {
    expect(articleSummaryResponseSchema.parse(base)).toEqual({
      articleId: "1",
      record: camelRecord,
      title: "感想",
      createdAt: "2026-10-01T12:00:00Z",
      updatedAt: "2026-10-02T12:00:00Z",
    });
  });

  it("rejects a summary without a record", () => {
    const { record: _record, ...rest } = base;
    expect(articleSummaryResponseSchema.safeParse(rest).success).toBe(false);
  });
});
