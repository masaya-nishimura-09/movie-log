import { beforeEach, describe, expect, it, vi } from "vitest";

const apiFetch = vi.fn();

vi.mock("@/api/client/api-fetch", () => ({ apiFetch }));
vi.mock("@/api/client/request-json", () => ({
  jsonBody: (body: unknown, method = "POST") => ({
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }),
}));

beforeEach(() => {
  apiFetch.mockReset();
});

const input = {
  title: "感想",
  content: {
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text: "本文" }] }],
  },
};

const { updateArticle } = await import("@/api/article/update-article");

describe("updateArticle", () => {
  it("puts the article to /articles/{id} in the API format", async () => {
    apiFetch.mockResolvedValue({ articleId: "1" });
    await updateArticle("1", input);
    const [path, , init] = apiFetch.mock.calls[0] ?? [];
    expect(path).toBe("/articles/1");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body)).toEqual({
      title: "感想",
      content: input.content,
    });
  });

  it("encodes the article ID", async () => {
    apiFetch.mockResolvedValue({ articleId: "1" });
    await updateArticle("a/b", input);
    expect(apiFetch.mock.calls[0]?.[0]).toBe("/articles/a%2Fb");
  });
});
