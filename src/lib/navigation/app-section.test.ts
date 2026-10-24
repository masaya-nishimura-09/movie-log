import { describe, expect, it } from "vitest";
import { appSectionOf } from "@/lib/navigation/app-section";

describe("appSectionOf", () => {
  it("treats the record pages as records", () => {
    for (const path of ["/ja/records", "/ja/records/1", "/ja/records/1/edit"]) {
      expect(appSectionOf(path, "ja"), path).toBe("records");
    }
  });

  it("treats the article list and the article pages under a record as articles", () => {
    for (const path of [
      "/ja/articles",
      "/ja/records/1/articles/2",
      "/ja/records/1/articles/2/edit",
      "/ja/records/1/articles/new",
    ]) {
      expect(appSectionOf(path, "ja"), path).toBe("articles");
    }
  });

  it("treats the home page as home", () => {
    expect(appSectionOf("/ja/home", "ja")).toBe("home");
  });

  it("treats the new record page as its own section", () => {
    expect(appSectionOf("/ja/records/new", "ja")).toBe("newRecord");
  });

  it("returns nothing for other pages and other languages", () => {
    expect(appSectionOf("/ja/account", "ja")).toBeUndefined();
    expect(appSectionOf("/en/records", "ja")).toBeUndefined();
  });
});
