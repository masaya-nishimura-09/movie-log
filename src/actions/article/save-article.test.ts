import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const createArticle = vi.fn();
const updateArticle = vi.fn();

vi.mock("next/navigation", () => import("@/test/next-navigation"));
vi.mock("@/api/article/create-article", () => ({ createArticle }));
vi.mock("@/api/article/update-article", () => ({ updateArticle }));

const { createArticleAction, updateArticleAction } = await import(
  "@/actions/article/save-article"
);

const content = {
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text: "本文" }] }],
};

function form(fields: Record<string, string> = {}) {
  const values: Record<string, string> = {
    title: "感想",
    content: JSON.stringify(content),
    ...fields,
  };
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.append(key, value);
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createArticleAction", () => {
  it("creates the article under the record and moves to it", async () => {
    createArticle.mockResolvedValue({
      articleId: "42",
      record: { recordId: "3" },
    });
    await expect(
      createArticleAction("en", "3", undefined, undefined, form()),
    ).rejects.toThrow("REDIRECT /en/records/3/articles/42");
    expect(createArticle).toHaveBeenCalledWith("3", {
      title: "感想",
      content,
    });
    expect(updateArticle).not.toHaveBeenCalled();
  });

  it("keeps the record page to go back to", async () => {
    createArticle.mockResolvedValue({
      articleId: "42",
      record: { recordId: "3" },
    });
    await expect(
      createArticleAction(
        "ja",
        "3",
        "/ja/records/3?from=%2Fja%2Frecords%3Fq%3Da",
        undefined,
        form(),
      ),
    ).rejects.toThrow(
      `REDIRECT /ja/records/3/articles/42?from=${encodeURIComponent("/ja/records/3?from=%2Fja%2Frecords%3Fq%3Da")}`,
    );
  });

  it("returns field errors for invalid input", async () => {
    const result = await createArticleAction(
      "ja",
      "3",
      undefined,
      undefined,
      form({ title: "", content: "{broken" }),
    );
    expect(result).toMatchObject({
      success: false,
      messageKey: "invalidInput",
    });
    expect(
      Object.keys(result.success ? {} : (result.errors ?? {})).sort(),
    ).toEqual(["content", "title"]);
    expect(createArticle).not.toHaveBeenCalled();
  });

  const cases = [
    [new ApiError(404, "RECORD_NOT_FOUND"), "recordNotFound"],
    [new ApiError(400, "INVALID_INPUT"), "invalidInput"],
    [new ApiError(500, "INTERNAL_SERVER_ERROR"), "unexpectedError"],
  ] as const;
  for (const [error, messageKey] of cases) {
    it(`returns ${messageKey} for ${error.code}`, async () => {
      createArticle.mockRejectedValue(error);
      await expect(
        createArticleAction("ja", "3", undefined, undefined, form()),
      ).resolves.toEqual({ success: false, messageKey });
    });
  }

  it("rethrows errors that are not API errors", async () => {
    createArticle.mockRejectedValue(new Error("network"));
    await expect(
      createArticleAction("ja", "3", undefined, undefined, form()),
    ).rejects.toThrow("network");
  });
});

describe("updateArticleAction", () => {
  it("updates the article and moves to it", async () => {
    updateArticle.mockResolvedValue({
      articleId: "7",
      record: { recordId: "3" },
    });
    await expect(
      updateArticleAction("ja", "7", undefined, undefined, form()),
    ).rejects.toThrow("REDIRECT /ja/records/3/articles/7");
    expect(updateArticle).toHaveBeenCalledWith("7", {
      title: "感想",
      content,
    });
    expect(createArticle).not.toHaveBeenCalled();
  });

  it("keeps the list to go back to", async () => {
    updateArticle.mockResolvedValue({
      articleId: "7",
      record: { recordId: "3" },
    });
    await expect(
      updateArticleAction(
        "ja",
        "7",
        "/ja/articles?keyword=音",
        undefined,
        form(),
      ),
    ).rejects.toThrow(
      `REDIRECT /ja/records/3/articles/7?from=${encodeURIComponent("/ja/articles?keyword=%E9%9F%B3")}`,
    );
  });

  it("ignores a list to go back to that is not the article list", async () => {
    updateArticle.mockResolvedValue({
      articleId: "7",
      record: { recordId: "3" },
    });
    await expect(
      updateArticleAction(
        "ja",
        "7",
        "https://evil.example/",
        undefined,
        form(),
      ),
    ).rejects.toThrow(/^REDIRECT \/ja\/records\/3\/articles\/7$/);
  });

  it("returns notFound when the article was deleted", async () => {
    updateArticle.mockRejectedValue(new ApiError(404, "ARTICLE_NOT_FOUND"));
    await expect(
      updateArticleAction("ja", "7", undefined, undefined, form()),
    ).resolves.toEqual({ success: false, messageKey: "notFound" });
  });
});
