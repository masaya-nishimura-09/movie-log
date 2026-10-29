import { describe, expect, it } from "vitest";
import { defaultTimeZone, resolveTimeZone } from "@/lib/date/time-zone";

describe("resolveTimeZone", () => {
  it("keeps a valid IANA time zone", () => {
    expect(resolveTimeZone("America/Los_Angeles")).toBe("America/Los_Angeles");
    expect(resolveTimeZone("UTC")).toBe("UTC");
  });

  it("falls back to Asia/Tokyo for a missing or unknown time zone", () => {
    expect(resolveTimeZone(undefined)).toBe(defaultTimeZone);
    expect(resolveTimeZone("")).toBe(defaultTimeZone);
    expect(resolveTimeZone("Mars/Olympus")).toBe(defaultTimeZone);
  });
});
