import { describe, expect, it } from "vitest";
import { toDateInputValue } from "@/lib/date/format-date";

describe("toDateInputValue", () => {
  it("returns the local date", () => {
    expect(toDateInputValue(new Date("2026-10-10T15:30:00Z"))).toBe(
      "2026-10-11",
    );
  });
});
