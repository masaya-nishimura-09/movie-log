import { beforeEach, describe, expect, it, vi } from "vitest";

const apiFetch = vi.fn();

vi.mock("@/api/client/api-fetch", () => ({ apiFetch }));

beforeEach(() => {
  apiFetch.mockReset();
});

const { getAllArticlesWithContent } = await import(
  "@/api/article/get-all-articles-with-content"
);

function params(call: number) {
  const path = String(apiFetch.mock.calls[call]?.[0]);
  return new URL(path, "http://api").searchParams;
}

describe("getAllArticlesWithContent", () => {
  it("asks for the bodies, oldest first, 100 at a time", async () => {
    apiFetch.mockResolvedValue({ articles: [], filteredCount: 0 });
    await getAllArticlesWithContent();
    expect(String(apiFetch.mock.calls[0]?.[0])).toMatch(/^\/articles\/\?/);
    expect(Object.fromEntries(params(0))).toEqual({
      include_content: "true",
      sort_field: "created_at",
      sort_order: "asc",
      page: "1",
      per_page: "100",
    });
  });

  it("reads every page and joins the articles in order", async () => {
    apiFetch.mockImplementation((path: string) => {
      const page = new URL(path, "http://api").searchParams.get("page");
      return Promise.resolve({
        articles: [{ articleId: `p${page}` }],
        filteredCount: 250,
      });
    });
    await expect(getAllArticlesWithContent()).resolves.toEqual([
      { articleId: "p1" },
      { articleId: "p2" },
      { articleId: "p3" },
    ]);
    expect(apiFetch).toHaveBeenCalledTimes(3);
  });
});
