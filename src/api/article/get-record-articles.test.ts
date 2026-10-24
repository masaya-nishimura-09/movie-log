import { beforeEach, describe, expect, it, vi } from "vitest";

const getArticles = vi.fn();

vi.mock("@/api/article/get-articles", () => ({ getArticles }));

beforeEach(() => {
  getArticles.mockReset();
});

const { getRecordArticles, recordArticlePreviewCount } = await import(
  "@/api/article/get-record-articles"
);

describe("getRecordArticles", () => {
  it("previews three articles of the record, most recently updated first", async () => {
    getArticles.mockResolvedValue({
      articles: [{ articleId: "1" }],
      filteredCount: 1,
    });
    await getRecordArticles("5");
    expect(recordArticlePreviewCount).toBe(3);
    expect(getArticles).toHaveBeenCalledWith(
      { recordId: "5", keyword: "", sort: "updatedAtDesc", page: 1 },
      3,
    );
  });

  it("returns the previewed articles with the total of the record, not of the page", async () => {
    getArticles.mockResolvedValue({
      articles: [{ articleId: "1" }, { articleId: "2" }],
      filteredCount: 9,
    });
    await expect(getRecordArticles("5")).resolves.toEqual({
      articles: [{ articleId: "1" }, { articleId: "2" }],
      total: 9,
    });
  });

  it("returns an empty preview with a zero total for a record without articles", async () => {
    getArticles.mockResolvedValue({ articles: [], filteredCount: 0 });
    await expect(getRecordArticles("6")).resolves.toEqual({
      articles: [],
      total: 0,
    });
  });

  it("returns no articles without asking the API when the ID is not a number", async () => {
    await expect(getRecordArticles("abc")).resolves.toEqual({
      articles: [],
      total: 0,
    });
    expect(getArticles).not.toHaveBeenCalled();
  });
});
