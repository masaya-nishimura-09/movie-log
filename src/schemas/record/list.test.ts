import { describe, expect, it } from "vitest";
import { recordListResponseSchema, recordSorts } from "@/schemas/record/list";

describe("recordListResponseSchema", () => {
  it("converts the counts to camelCase", () => {
    expect(
      recordListResponseSchema.parse({
        records: [],
        filtered_count: 3,
        total_count: 10,
      }),
    ).toEqual({ records: [], filteredCount: 3, totalCount: 10 });
  });

  it("rejects a negative count", () => {
    expect(
      recordListResponseSchema.safeParse({
        records: [],
        filtered_count: -1,
        total_count: 10,
      }).success,
    ).toBe(false);
  });
});

describe("recordSorts", () => {
  it("lists the sorts in the order shown on screen", () => {
    expect(recordSorts).toEqual([
      "watchedAtDesc",
      "watchedAtAsc",
      "scoreDesc",
      "releaseYearDesc",
      "titleAsc",
    ]);
  });
});
