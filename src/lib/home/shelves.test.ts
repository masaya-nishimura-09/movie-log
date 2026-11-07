import { describe, expect, it } from "vitest";
import { pickShelfMoods } from "@/lib/home/shelves";

describe("pickShelfMoods", () => {
  it("picks moods with two or more records, the largest first (ties in the defined order), up to three", () => {
    expect(
      pickShelfMoods([
        { moodTag: "absurd", count: 0 },
        { moodTag: "cozy", count: 2 },
        { moodTag: "dark", count: 2 },
        { moodTag: "epic", count: 2 },
        { moodTag: "moving", count: 3 },
        { moodTag: "surreal", count: 1 },
      ]),
    ).toEqual(["moving", "dark", "epic"]);
  });

  it("returns no mood when no mood has two records", () => {
    expect(
      pickShelfMoods([
        { moodTag: "moving", count: 1 },
        { moodTag: "dark", count: 0 },
      ]),
    ).toEqual([]);
  });
});
