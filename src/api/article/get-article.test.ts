import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const apiFetch = vi.fn();

vi.mock("@/api/client/api-fetch", () => ({ apiFetch }));

beforeEach(() => {
  apiFetch.mockReset();
});

const { getArticle } = await import("@/api/article/get-article");

describe("getArticle", () => {
  it("gets /articles/{id}", async () => {
    apiFetch.mockResolvedValue({ articleId: "1" });
    await expect(getArticle("1")).resolves.toEqual({ articleId: "1" });
    expect(apiFetch.mock.calls[0]?.[0]).toBe("/articles/1");
  });

  it("returns undefined without asking the API when the ID is not a number", async () => {
    await expect(getArticle("a/b")).resolves.toBeUndefined();
    await expect(getArticle("abc")).resolves.toBeUndefined();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("returns undefined when the article does not exist", async () => {
    apiFetch.mockRejectedValue(new ApiError(404, "ARTICLE_NOT_FOUND"));
    await expect(getArticle("2")).resolves.toBeUndefined();
  });

  it("rethrows other errors", async () => {
    const error = new ApiError(500, "INTERNAL_SERVER_ERROR");
    apiFetch.mockRejectedValue(error);
    await expect(getArticle("3")).rejects.toBe(error);
  });
});
