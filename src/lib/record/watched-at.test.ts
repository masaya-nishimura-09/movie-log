import { describe, expect, it } from "vitest";
import { convertWatchedAt } from "@/lib/record/watched-at";

describe("convertWatchedAt", () => {
  it("converts the watch date to midnight of the local time zone", () => {
    const formData = new FormData();
    formData.set("watchedAt", "2026-10-11");
    convertWatchedAt(formData);
    expect(formData.get("watchedAt")).toBe("2026-10-10T15:00:00Z");
  });

  it("leaves a missing watch date empty", () => {
    const formData = new FormData();
    convertWatchedAt(formData);
    expect(formData.get("watchedAt")).toBe("");
  });
});
