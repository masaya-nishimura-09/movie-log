import { describe, expect, it } from "vitest";
import { interpolate } from "@/lib/text/interpolate";

describe("interpolate", () => {
  it("replaces each placeholder with its value", () => {
    expect(interpolate("{count} / {max}", { count: 3, max: 100 })).toBe(
      "3 / 100",
    );
  });

  it("leaves placeholders without a value as they are", () => {
    expect(interpolate("{count} / {max}", { count: 3 })).toBe("3 / {max}");
  });
});
