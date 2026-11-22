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

const { getRecords } = await import("@/api/record/get-records");

const query = {
  score: undefined,
  platform: undefined,
  moodTags: [],
  genres: [],
  keyword: "",
  sort: "watchedAtDesc" as const,
  page: 1,
};

function list(filteredCount: number) {
  return { records: [], totalCount: 30, filteredCount };
}

function params(call: number) {
  const path = String(apiFetch.mock.calls[call]?.[0]);
  return new URL(path, "http://api").searchParams;
}

describe("getRecords", () => {
  it("sends the default query", async () => {
    apiFetch.mockResolvedValue(list(30));
    await getRecords(query);
    expect(String(apiFetch.mock.calls[0]?.[0])).toMatch(/^\/records\/\?/);
    expect([...params(0)]).toEqual([
      ["sort_field", "watched_at"],
      ["sort_order", "desc"],
      ["page", "1"],
      ["per_page", "100"],
    ]);
  });

  it("sends every filter", async () => {
    apiFetch.mockResolvedValue(list(30));
    await getRecords({
      ...query,
      score: 4,
      platform: "netflix",
      moodTags: ["moving", "dark"],
      genres: ["drama"],
      keyword: "Arrival",
      page: 2,
    });
    const sent = params(0);
    expect(sent.get("score")).toBe("4");
    expect(sent.get("platform")).toBe("netflix");
    expect(sent.getAll("mood_tags")).toEqual(["moving", "dark"]);
    expect(sent.getAll("genres")).toEqual(["drama"]);
    expect(sent.get("keyword")).toBe("Arrival");
    expect(sent.get("page")).toBe("1");
  });

  it("converts each sort to a field and an order", async () => {
    apiFetch.mockResolvedValue(list(30));
    const sorts = {
      watchedAtDesc: ["watched_at", "desc"],
      watchedAtAsc: ["watched_at", "asc"],
      scoreDesc: ["score", "desc"],
      releaseYearDesc: ["release_year", "desc"],
      titleAsc: ["title", "asc"],
    } as const;
    for (const [index, [sort, [field, order]]] of Object.entries(
      sorts,
    ).entries()) {
      await getRecords({ ...query, sort: sort as keyof typeof sorts });
      expect(params(index).get("sort_field")).toBe(field);
      expect(params(index).get("sort_order")).toBe(order);
    }
  });

  it("returns every matching record across the API pages", async () => {
    const record = (id: string) => ({ recordId: id });
    apiFetch.mockImplementation(async (path: string) => {
      const page = new URL(path, "http://api").searchParams.get("page");
      return {
        records:
          page === "1" ? [record("a"), record("b")] : [record(`c${page}`)],
        totalCount: 230,
        filteredCount: 201,
      };
    });
    const result = await getRecords(query);
    expect(apiFetch).toHaveBeenCalledTimes(3);
    expect(result).toEqual({
      records: [record("a"), record("b"), record("c2"), record("c3")],
      totalCount: 230,
      filteredCount: 201,
    });
  });

  it("asks only once when there are no records", async () => {
    apiFetch.mockResolvedValue(list(0));
    await expect(getRecords(query)).resolves.toEqual({
      records: [],
      totalCount: 30,
      filteredCount: 0,
    });
    expect(apiFetch).toHaveBeenCalledTimes(1);
  });
});
