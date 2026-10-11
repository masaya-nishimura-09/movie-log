import { describe, expect, it } from "vitest";
import { scoreSchema, scores } from "@/schemas/record/enums";

describe("scores", () => {
  it("lists the scores from high to low", () => {
    expect(scores).toEqual([5, 4, 3, 2, 1]);
  });
});

describe("scoreSchema", () => {
  it("accepts 1 to 5 only", () => {
    expect(scoreSchema.safeParse(1).success).toBe(true);
    expect(scoreSchema.safeParse(5).success).toBe(true);
    expect(scoreSchema.safeParse(0).success).toBe(false);
    expect(scoreSchema.safeParse(3.5).success).toBe(false);
  });
});
