import { describe, expect, it, vi } from "vitest";

const getAllRecords = vi.fn();

vi.mock("@/api/record/get-all-records", () => ({ getAllRecords }));

const { getRecordOptions } = await import("@/api/record/get-record-options");

describe("getRecordOptions", () => {
  it("gets every record sorted by title and keeps only what a filter needs", async () => {
    getAllRecords.mockResolvedValue([
      { recordId: "2", title: "Arrival", releaseYear: 2016, score: 5 },
      { recordId: "1", title: "Breathless", releaseYear: 1960, score: 4 },
    ]);
    await expect(getRecordOptions()).resolves.toEqual([
      { recordId: "2", title: "Arrival", releaseYear: 2016 },
      { recordId: "1", title: "Breathless", releaseYear: 1960 },
    ]);
    expect(getAllRecords).toHaveBeenCalledWith("title", "asc");
  });
});
