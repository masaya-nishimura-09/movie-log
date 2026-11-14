import { describe, expect, it } from "vitest";
import { errorSteps, isRecordStep } from "@/lib/record/field-step";

describe("isRecordStep", () => {
  it("accepts only the step names", () => {
    expect(isRecordStep("basics")).toBe(true);
    expect(isRecordStep("movie")).toBe(true);
    expect(isRecordStep("impression")).toBe(true);
    expect(isRecordStep("constructor")).toBe(false);
    expect(isRecordStep("__proto__")).toBe(false);
    expect(isRecordStep(undefined)).toBe(false);
  });
});

describe("errorSteps", () => {
  it("returns no steps when there are no errors", () => {
    expect(errorSteps(undefined)).toEqual([]);
    expect(errorSteps({})).toEqual([]);
  });

  it("returns each step with an error once, in order", () => {
    expect(
      errorSteps({ note: ["x"], releaseYear: ["x"], runtime: ["x"] }),
    ).toEqual([1, 2]);
  });

  it("treats a field without a step as the first step", () => {
    expect(errorSteps({ unknown: ["x"], moodTags: ["x"] })).toEqual([0, 2]);
  });
});
