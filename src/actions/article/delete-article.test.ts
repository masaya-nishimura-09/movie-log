import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const deleteArticle = vi.fn();

vi.mock("next/navigation", () => import("@/test/next-navigation"));
vi.mock("@/api/article/delete-article", () => ({ deleteArticle }));

const { deleteArticleAction } = await import(
  "@/actions/article/delete-article"
);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("deleteArticleAction", () => {
  it("deletes the article and moves to its record", async () => {
    deleteArticle.mockResolvedValue(undefined);
    await expect(deleteArticleAction("en", "3", "9")).rejects.toThrow(
      "REDIRECT /en/records/3",
    );
    expect(deleteArticle).toHaveBeenCalledWith("9");
  });

  it("moves back to the article list it came from", async () => {
    deleteArticle.mockResolvedValue(undefined);
    await expect(
      deleteArticleAction("ja", "3", "9", "/ja/articles?keyword=音"),
    ).rejects.toThrow("REDIRECT /ja/articles?keyword=%E9%9F%B3");
  });

  it("moves back to the record page it came from, keeping its own back link", async () => {
    deleteArticle.mockResolvedValue(undefined);
    await expect(
      deleteArticleAction("ja", "3", "9", "/ja/records/3?from=%2Fja%2Frecords"),
    ).rejects.toThrow("REDIRECT /ja/records/3?from=%2Fja%2Frecords");
  });

  it("ignores a list to go back to that is not the article list", async () => {
    deleteArticle.mockResolvedValue(undefined);
    await expect(
      deleteArticleAction("ja", "3", "9", "/ja/records/1?from=%2Fja%2Frecords"),
    ).rejects.toThrow(/^REDIRECT \/ja\/records\/3$/);
  });

  it("moves to the record when the article is already gone", async () => {
    deleteArticle.mockRejectedValue(new ApiError(404, "ARTICLE_NOT_FOUND"));
    await expect(deleteArticleAction("ja", "3", "9")).rejects.toThrow(
      "REDIRECT /ja/records/3",
    );
  });

  it("returns unexpectedError on other API errors", async () => {
    deleteArticle.mockRejectedValue(new ApiError(500, "INTERNAL_SERVER_ERROR"));
    await expect(deleteArticleAction("ja", "3", "9")).resolves.toEqual({
      success: false,
      messageKey: "unexpectedError",
    });
  });

  it("rethrows errors that are not API errors", async () => {
    deleteArticle.mockRejectedValue(new Error("network"));
    await expect(deleteArticleAction("ja", "3", "9")).rejects.toThrow(
      "network",
    );
  });
});
