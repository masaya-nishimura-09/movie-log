import { describe, expect, it } from "vitest";
import { cn } from "@/lib/style/cn";

describe("cn", () => {
  it("joins class names and skips falsy values", () => {
    expect(cn("a", false, undefined, "b", { c: true, d: false })).toBe("a b c");
  });

  it("lets later Tailwind classes win over conflicting ones", () => {
    expect(cn("px-2 text-sm", "px-4")).toBe("text-sm px-4");
  });
});
