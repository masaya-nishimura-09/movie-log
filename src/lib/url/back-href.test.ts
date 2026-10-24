import { describe, expect, it } from "vitest";
import { fromKey, safeFromHref, withFrom } from "@/lib/url/back-href";

const path = "/ja/articles";

describe("safeFromHref", () => {
  it("accepts the allowed path, with or without a query", () => {
    expect(safeFromHref("/ja/articles", path)).toBe("/ja/articles");
    expect(safeFromHref("/ja/articles?keyword=%E9%9F%B3&page=2", path)).toBe(
      "/ja/articles?keyword=%E9%9F%B3&page=2",
    );
  });

  it("accepts any of several allowed paths", () => {
    const paths = ["/ja/articles", "/ja/records/3"];
    expect(safeFromHref("/ja/records/3?from=%2Fja%2Frecords", paths)).toBe(
      "/ja/records/3?from=%2Fja%2Frecords",
    );
    expect(safeFromHref("/ja/articles", paths)).toBe("/ja/articles");
    expect(safeFromHref("/ja/records/4", paths)).toBeUndefined();
  });

  it("returns nothing for a missing or empty value", () => {
    expect(safeFromHref(undefined, path)).toBeUndefined();
    expect(safeFromHref("", path)).toBeUndefined();
    expect(safeFromHref([], path)).toBeUndefined();
  });

  it("takes the first value when it is repeated", () => {
    expect(safeFromHref(["/ja/articles?page=2", "/ja/account"], path)).toBe(
      "/ja/articles?page=2",
    );
    expect(safeFromHref(["/ja/account", "/ja/articles"], path)).toBeUndefined();
  });

  it("rejects a path other than the allowed one", () => {
    for (const value of [
      "/ja/account",
      "/ja/records",
      "/en/articles",
      "/ja/articles/1",
      "/ja/articlesx",
      "/ja/articles/",
      "/",
    ]) {
      expect(safeFromHref(value, path), value).toBeUndefined();
    }
  });

  it("rejects an address on another site", () => {
    for (const value of [
      "https://evil.example/ja/articles",
      "http://evil.example",
      "//evil.example/ja/articles",
      "///evil.example",
      "\\\\evil.example",
      "/\\evil.example",
      "javascript:alert(1)",
      "data:text/html,x",
      "ja/articles",
    ]) {
      expect(safeFromHref(value, path), value).toBeUndefined();
    }
  });

  it("does not let line breaks or tabs slip another place into the path", () => {
    expect(safeFromHref("/ja/articles\n?x=1", path)).toBe("/ja/articles?x=1");
    expect(safeFromHref("/\t/evil.example", path)).toBeUndefined();
    expect(safeFromHref("/\n/evil.example", path)).toBeUndefined();
  });

  it("rejects a value that is too long", () => {
    expect(
      safeFromHref(`/ja/articles?keyword=${"a".repeat(2000)}`, path),
    ).toBeUndefined();
  });

  it("drops a fragment", () => {
    expect(safeFromHref("/ja/articles?page=2#top", path)).toBe(
      "/ja/articles?page=2",
    );
  });
});

describe("withFrom", () => {
  it("leaves the link as it is without a from", () => {
    expect(withFrom("/ja/records/1", undefined)).toBe("/ja/records/1");
  });

  it("adds the list address as an encoded parameter", () => {
    const href = withFrom("/ja/records/1", "/ja/records?score=4&page=2");
    expect(href).toBe(
      `/ja/records/1?${fromKey}=%2Fja%2Frecords%3Fscore%3D4%26page%3D2`,
    );
  });

  it("round-trips through the check", () => {
    const from = "/ja/articles?keyword=%E9%9F%B3&record=3&page=2";
    const href = withFrom("/ja/records/3/articles/9", from);
    const raw = new URL(href, "http://x").searchParams.get(fromKey) ?? "";
    expect(safeFromHref(raw, "/ja/articles")).toBe(from);
  });
});
