import { describe, expect, it } from "vitest";
import { isResourceId } from "@/lib/url/resource-id";

describe("isResourceId", () => {
  it("accepts a positive integer", () => {
    expect(isResourceId("1")).toBe(true);
    expect(isResourceId("120")).toBe(true);
  });

  it("rejects anything else", () => {
    for (const value of ["", "0", "007", "-3", "1.5", "abc", "1a", "a/b"]) {
      expect(isResourceId(value)).toBe(false);
    }
  });
});
