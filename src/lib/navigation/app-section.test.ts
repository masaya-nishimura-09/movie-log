import { describe, expect, it } from "vitest";
import { appSectionOf } from "@/lib/navigation/app-section";

describe("appSectionOf", () => {
  it("treats the record pages as records", () => {
    for (const path of ["/ja/records", "/ja/records/1", "/ja/records/1/edit"]) {
      expect(appSectionOf(path, "ja"), path).toBe("records");
    }
  });

  it("treats the new record page as its own section", () => {
    expect(appSectionOf("/ja/records/new", "ja")).toBe("newRecord");
  });

  it("returns nothing for other pages and other languages", () => {
    expect(appSectionOf("/ja/account", "ja")).toBeUndefined();
    expect(appSectionOf("/en/records", "ja")).toBeUndefined();
  });
});
