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

const { createArticle } = await import("@/api/article/create-article");

describe("createArticle", () => {
  it("posts the article to /articles/ with the record ID in the body", async () => {
    apiFetch.mockResolvedValue({ articleId: "1" });
    await expect(createArticle("2", input)).resolves.toEqual({
      articleId: "1",
    });
    const [path, , init] = apiFetch.mock.calls[0] ?? [];
    expect(path).toBe("/articles/");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      record_id: "2",
      title: "感想",
      content: input.content,
    });
  });

  it("sends the record ID as it is", async () => {
    apiFetch.mockResolvedValue({ articleId: "1" });
    await createArticle("a/b", input);
    expect(JSON.parse(apiFetch.mock.calls[0]?.[2].body).record_id).toBe("a/b");
  });
});
