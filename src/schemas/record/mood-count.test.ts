import { describe, expect, it } from "vitest";
import { moodCountListResponseSchema } from "@/schemas/record/mood-count";

describe("moodCountListResponseSchema", () => {
  it("converts each count to camelCase", () => {
    expect(
      moodCountListResponseSchema.parse({
        mood_tag_counts: [
          { mood_tag: "absurd", count: 0 },
          { mood_tag: "moving", count: 3 },
        ],
      }),
    ).toEqual([
      { moodTag: "absurd", count: 0 },
      { moodTag: "moving", count: 3 },
    ]);
  });

  it("rejects an unknown mood", () => {
    expect(
      moodCountListResponseSchema.safeParse({
        mood_tag_counts: [{ mood_tag: "unknown", count: 1 }],
      }).success,
    ).toBe(false);
  });

  it("rejects a negative count", () => {
    expect(
      moodCountListResponseSchema.safeParse({
        mood_tag_counts: [{ mood_tag: "moving", count: -1 }],
      }).success,
    ).toBe(false);
  });
});
