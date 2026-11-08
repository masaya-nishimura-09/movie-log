import { beforeEach, describe, expect, it, vi } from "vitest";

const apiFetch = vi.fn();

vi.mock("@/api/client/api-fetch", () => ({ apiFetch }));

beforeEach(() => {
  apiFetch.mockReset();
});

const { getAllRecordsWithNotes } = await import(
  "@/api/record/get-all-records-with-notes"
);

function params(call: number) {
  const path = String(apiFetch.mock.calls[call]?.[0]);
  return new URL(path, "http://api").searchParams;
}

describe("getAllRecordsWithNotes", () => {
  it("asks for the notes, oldest watched first, 100 at a time", async () => {
    apiFetch.mockResolvedValue({ records: [], filteredCount: 0 });
    await getAllRecordsWithNotes();
    expect(String(apiFetch.mock.calls[0]?.[0])).toMatch(/^\/records\/\?/);
    expect(Object.fromEntries(params(0))).toEqual({
      include_note: "true",
      sort_field: "watched_at",
      sort_order: "asc",
      page: "1",
      per_page: "100",
    });
  });

  it("reads every page and joins the records in order", async () => {
    apiFetch.mockImplementation((path: string) => {
      const page = new URL(path, "http://api").searchParams.get("page");
      return Promise.resolve({
        records: [{ recordId: `p${page}` }],
        filteredCount: 250,
      });
    });
    await expect(getAllRecordsWithNotes()).resolves.toEqual([
      { recordId: "p1" },
      { recordId: "p2" },
      { recordId: "p3" },
    ]);
    expect(apiFetch).toHaveBeenCalledTimes(3);
  });
});
