import { beforeEach, describe, expect, it, vi } from "vitest";

const apiFetch = vi.fn();

vi.mock("@/api/client/api-fetch", () => ({ apiFetch }));

beforeEach(() => {
  apiFetch.mockReset();
});

const { getRecordOptions } = await import("@/api/record/get-record-options");

describe("getRecordOptions", () => {
  it("gets the records sorted by title and keeps only what a filter needs", async () => {
    apiFetch.mockResolvedValue({
      records: [
        { recordId: "2", title: "Arrival", releaseYear: 2016, score: 5 },
        { recordId: "1", title: "Breathless", releaseYear: 1960, score: 4 },
      ],
      filteredCount: 2,
      totalCount: 2,
    });
    await expect(getRecordOptions()).resolves.toEqual([
      { recordId: "2", title: "Arrival", releaseYear: 2016 },
      { recordId: "1", title: "Breathless", releaseYear: 1960 },
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
    const options = await getRecordOptions();
    expect(options).toHaveLength(250);
    expect(options[249]?.recordId).toBe("250");
    const paths = apiFetch.mock.calls.map((call) => call[0] as string);
    expect(
      paths.map((p) => new URLSearchParams(p.split("?")[1]).get("page")),
    ).toEqual(["1", "2", "3"]);
  });
});
