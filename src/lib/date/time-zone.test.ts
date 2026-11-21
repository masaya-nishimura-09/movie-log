import { describe, expect, it } from "vitest";
import { validTimeZone } from "@/lib/date/time-zone";

describe("validTimeZone", () => {
  it("returns a known IANA time zone", () => {
    expect(validTimeZone("Asia/Tokyo")).toBe("Asia/Tokyo");
  });

  it("returns undefined for an unknown or missing value", () => {
    expect(validTimeZone("Mars/Base")).toBeUndefined();
    expect(validTimeZone("")).toBeUndefined();
    expect(validTimeZone(undefined)).toBeUndefined();
  });
});
