import { describe, expect, it } from "vitest";
import { startOfLocalDay } from "@/lib/date/start-of-local-day";

describe("startOfLocalDay", () => {
  it("returns midnight of the local time zone as UTC", () => {
    expect(startOfLocalDay("2026-10-11")).toBe("2026-10-10T15:00:00Z");
  });

  it("returns values that are not a date as they are", () => {
    expect(startOfLocalDay("2026-10-11T00:00:00Z")).toBe(
      "2026-10-11T00:00:00Z",
    );
  });
});
