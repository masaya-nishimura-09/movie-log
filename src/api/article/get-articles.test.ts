import { beforeEach, describe, expect, it, vi } from "vitest";

const apiFetch = vi.fn();

vi.mock("@/api/client/api-fetch", () => ({ apiFetch }));

beforeEach(() => {
  apiFetch.mockReset();
});

const { getArticles, articlePerPage } = await import(
  "@/api/article/get-articles"
);

const query = {
  recordId: undefined,
  keyword: "",
  sort: "updatedAtDesc" as const,
  page: 1,
};

function params(call = 0) {
  const path = apiFetch.mock.calls[call]?.[0] as string;
  return new URL(path, "http://x").searchParams;
}

describe("getArticles", () => {
  it("gets /articles/ and adds the page count", async () => {
    apiFetch.mockResolvedValue({
      articles: [{ articleId: "1" }],
      filteredCount: 25,
      totalCount: 50,
    });
    await expect(getArticles(query)).resolves.toEqual({
      articles: [{ articleId: "1" }],
      filteredCount: 25,
      totalCount: 50,
      page: 1,
      pageCount: 3,
    });
    expect(apiFetch.mock.calls[0]?.[0]).toMatch(/^\/articles\/\?/);
  });

  it("asks for 12 articles per page by default, as the record list does", async () => {
    apiFetch.mockResolvedValue({
      articles: [],
      filteredCount: 0,
      totalCount: 0,
    });
    await getArticles(query);
    expect(articlePerPage).toBe(12);
    expect(params().get("per_page")).toBe("12");
    expect(params().get("page")).toBe("1");
  });

  it("sends only the filters that are set", async () => {
    apiFetch.mockResolvedValue({
      articles: [],
      filteredCount: 0,
      totalCount: 0,
    });
    await getArticles(query);
    expect(params().has("record_id")).toBe(false);
    expect(params().has("keyword")).toBe(false);
    await getArticles({ ...query, recordId: "7", keyword: "音" });
    expect(params(1).get("record_id")).toBe("7");
    expect(params(1).get("keyword")).toBe("音");
  });

  it("encodes the keyword", async () => {
    apiFetch.mockResolvedValue({
      articles: [],
      filteredCount: 0,
      totalCount: 0,
    });
    await getArticles({ ...query, keyword: "a&b=c d" });
    expect(params().get("keyword")).toBe("a&b=c d");
  });

  it("maps each sort to the backend's field and order", async () => {
    apiFetch.mockResolvedValue({
      articles: [],
      filteredCount: 0,
      totalCount: 0,
    });
    const cases = [
      ["updatedAtDesc", "updated_at", "desc"],
      ["updatedAtAsc", "updated_at", "asc"],
      ["createdAtDesc", "created_at", "desc"],
      ["createdAtAsc", "created_at", "asc"],
      ["titleAsc", "title", "asc"],
    ] as const;
    for (const [index, [sort, field, order]] of cases.entries()) {
      await getArticles({ ...query, sort });
      expect(params(index).get("sort_field")).toBe(field);
      expect(params(index).get("sort_order")).toBe(order);
    }
  });

  it("uses the given page size", async () => {
    apiFetch.mockResolvedValue({
      articles: [],
      filteredCount: 0,
      totalCount: 0,
    });
    await getArticles(query, 100);
    expect(params().get("per_page")).toBe("100");
  });

  it("goes back to the last page when the page is past the end", async () => {
    apiFetch
      .mockResolvedValueOnce({
        articles: [],
        filteredCount: 25,
        totalCount: 25,
      })
      .mockResolvedValueOnce({
        articles: [{ articleId: "9" }],
        filteredCount: 25,
        totalCount: 25,
      });
    const list = await getArticles({ ...query, page: 9 });
    expect(list.page).toBe(3);
    expect(list.articles).toEqual([{ articleId: "9" }]);
    expect(params(1).get("page")).toBe("3");
  });

  it("keeps 12 articles on one page and starts a second page at 13", async () => {
    apiFetch.mockResolvedValue({
      articles: [],
      filteredCount: 12,
      totalCount: 12,
    });
    await expect(getArticles(query)).resolves.toMatchObject({ pageCount: 1 });
    apiFetch.mockResolvedValue({
      articles: [],
      filteredCount: 13,
      totalCount: 13,
    });
    await expect(getArticles(query)).resolves.toMatchObject({ pageCount: 2 });
  });

  it("has one page when nothing matches", async () => {
    apiFetch.mockResolvedValue({
      articles: [],
      filteredCount: 0,
      totalCount: 3,
    });
    await expect(getArticles(query)).resolves.toMatchObject({
      pageCount: 1,
      page: 1,
    });
  });
});
