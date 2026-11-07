import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const getAllArticlesWithContent = vi.fn();

vi.mock("@/api/article/get-all-articles-with-content", () => ({
  getAllArticlesWithContent,
}));

const { exportArticlesAction } = await import(
  "@/actions/article/export-articles"
);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("exportArticlesAction", () => {
  it("returns every article with its body", async () => {
    getAllArticlesWithContent.mockResolvedValue([{ articleId: "1" }]);
    await expect(exportArticlesAction()).resolves.toEqual({
      success: true,
      data: [{ articleId: "1" }],
    });
  });

  it("returns exportFailed on an API error and rethrows others", async () => {
    getAllArticlesWithContent.mockRejectedValue(
      new ApiError(500, "INTERNAL_SERVER_ERROR"),
    );
    await expect(exportArticlesAction()).resolves.toEqual({
      success: false,
      messageKey: "exportFailed",
    });
    getAllArticlesWithContent.mockRejectedValue(new Error("network"));
    await expect(exportArticlesAction()).rejects.toThrow("network");
  });
});
