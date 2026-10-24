import { describe, expect, it } from "vitest";
import { articleFrom, isFromArticleList } from "@/lib/article/article-from";

describe("articleFrom", () => {
  it("accepts the article list and the article's own record", () => {
    expect(articleFrom("/ja/articles?keyword=%E9%9F%B3", "ja", "3")).toBe(
      "/ja/articles?keyword=%E9%9F%B3",
    );
    expect(
      articleFrom("/ja/records/3?from=%2Fja%2Frecords%3Fq%3Da", "ja", "3"),
    ).toBe("/ja/records/3?from=%2Fja%2Frecords%3Fq%3Da");
  });

  it("rejects another record, another language and other pages", () => {
    for (const value of [
      "/ja/records/4",
      "/ja/records",
      "/en/articles",
      "/ja/account",
      "https://evil.example/ja/articles",
    ]) {
      expect(articleFrom(value, "ja", "3"), value).toBeUndefined();
    }
  });
});

describe("isFromArticleList", () => {
  it("tells the article list from the record", () => {
    expect(isFromArticleList("/ja/articles", "ja")).toBe(true);
    expect(isFromArticleList("/ja/articles?page=2", "ja")).toBe(true);
    expect(isFromArticleList("/ja/records/3", "ja")).toBe(false);
  });
});
