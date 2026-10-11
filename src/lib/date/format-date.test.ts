import { describe, expect, it } from "vitest";
import { formatDate, toDateInputValue } from "@/lib/date/format-date";

describe("formatDate", () => {
  const iso = "2026-10-10T15:30:00Z";

  it("formats in the local time zone for each style", () => {
    expect(formatDate(iso, "ja", "short")).toBe("10/11");
    expect(formatDate(iso, "ja", "medium")).toBe("2026/10/11");
    expect(formatDate(iso, "ja", "longDate")).toBe("2026年10月11日");
    expect(formatDate(iso, "ja", "dateTime")).toBe("2026/10/11 00:30");
  });

  it("follows the locale", () => {
    expect(formatDate(iso, "en", "longDate")).toBe("October 11, 2026");
    expect(formatDate(iso, "en", "medium")).toBe("10/11/2026");
  });
});

describe("toDateInputValue", () => {
  it("returns the local date", () => {
    expect(toDateInputValue(new Date("2026-10-10T15:30:00Z"))).toBe(
      "2026-10-11",
    );
  });
});
