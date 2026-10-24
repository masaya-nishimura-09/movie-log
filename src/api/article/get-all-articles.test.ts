import { beforeEach, describe, expect, it, vi } from "vitest";

const getArticles = vi.fn();

vi.mock("@/api/article/get-articles", () => ({ getArticles }));

beforeEach(() => {
  getArticles.mockReset();
});

const { getAllArticles } = await import("@/api/article/get-all-articles");

describe("getAllArticles", () => {
  it("gets every page, newest update first, 100 at a time", async () => {
    getArticles
      .mockResolvedValueOnce({ articles: [{ articleId: "1" }], pageCount: 3 })
      .mockResolvedValueOnce({ articles: [{ articleId: "2" }], pageCount: 3 })
      .mockResolvedValueOnce({ articles: [{ articleId: "3" }], pageCount: 3 });
    await expect(getAllArticles()).resolves.toEqual([
      { articleId: "1" },
      { articleId: "2" },
      { articleId: "3" },
    ]);
    expect(getArticles.mock.calls).toEqual([
      [{ keyword: "", sort: "updatedAtDesc", page: 1 }, 100],
      [{ keyword: "", sort: "updatedAtDesc", page: 2 }, 100],
      [{ keyword: "", sort: "updatedAtDesc", page: 3 }, 100],
    ]);
  });
});
