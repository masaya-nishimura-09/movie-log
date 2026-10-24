import { beforeEach, describe, expect, it, vi } from "vitest";

const apiFetch = vi.fn();

vi.mock("@/api/client/api-fetch", () => ({ apiFetch }));

beforeEach(() => {
  apiFetch.mockReset();
});

const { getAllRecords } = await import("@/api/record/get-all-records");

describe("getAllRecords", () => {
  it("gets the records in the given order, 100 at a time", async () => {
    apiFetch.mockResolvedValue({
      records: [
        { recordId: "2", title: "Arrival", releaseYear: 2016, score: 5 },
        { recordId: "1", title: "Breathless", releaseYear: 1960, score: 4 },
      ],
      filteredCount: 2,
      totalCount: 2,
    });
    await expect(getAllRecords("title", "asc")).resolves.toEqual([
      { recordId: "2", title: "Arrival", releaseYear: 2016, score: 5 },
      { recordId: "1", title: "Breathless", releaseYear: 1960, score: 4 },
    ]);
    const path = apiFetch.mock.calls[0]?.[0] as string;
    expect(path).toContain("/records/?");
    expect(path).toContain("sort_field=title");
    expect(path).toContain("sort_order=asc");
    expect(path).toContain("per_page=100");
  });

  it("gets every page when there are more than 100 records", async () => {
    const page = (start: number, count: number) => ({
      records: Array.from({ length: count }, (_, i) => ({
        recordId: String(start + i),
        title: `T${start + i}`,
        releaseYear: 2000,
      })),
      filteredCount: 250,
      totalCount: 250,
    });
    apiFetch
      .mockResolvedValueOnce(page(1, 100))
      .mockResolvedValueOnce(page(101, 100))
      .mockResolvedValueOnce(page(201, 50));
    const options = await getAllRecords("watched_at", "desc");
    expect(options).toHaveLength(250);
    expect(options[249]?.recordId).toBe("250");
    const paths = apiFetch.mock.calls.map((call) => call[0] as string);
    expect(
      paths.map((p) => new URLSearchParams(p.split("?")[1]).get("page")),
    ).toEqual(["1", "2", "3"]);
  });
});
