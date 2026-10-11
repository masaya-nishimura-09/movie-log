import { describe, expect, it } from "vitest";
import { recordFormValuesSchema } from "@/schemas/record/record-form";

describe("recordFormValuesSchema", () => {
  const values = {
    title: "",
    watchedAt: "",
    runtime: 0,
    genres: [],
    countries: [],
    language: "ja",
    credits: [],
    posterUrl: "",
    moodTags: [],
    memo: "",
  };

  it("allows a new record without release year, platform and score", () => {
    expect(recordFormValuesSchema.safeParse(values).success).toBe(true);
  });

  it("accepts a watch date that is not yet an ISO date", () => {
    expect(
      recordFormValuesSchema.safeParse({ ...values, watchedAt: "2026-10-11" })
        .success,
    ).toBe(true);
  });
});
