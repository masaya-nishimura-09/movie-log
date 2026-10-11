import { describe, expect, it } from "vitest";
import { buildHref, selectValue, toggleValue } from "@/lib/url/build-href";

describe("buildHref", () => {
  it("returns the pathname alone when there are no values", () => {
    expect(buildHref("/ja/records", {})).toBe("/ja/records");
  });

  it("skips undefined and empty values", () => {
    expect(
      buildHref("/ja/records", { q: "", sort: undefined, page: "2" }),
    ).toBe("/ja/records?page=2");
  });

  it("repeats the key for each item of an array", () => {
    expect(buildHref("/ja/records", { genre: ["drama", "comedy"] })).toBe(
      "/ja/records?genre=drama&genre=comedy",
    );
  });

  it("encodes the values", () => {
    expect(buildHref("/ja/records", { q: "千と千尋 & 神隠し" })).toBe(
      "/ja/records?q=%E5%8D%83%E3%81%A8%E5%8D%83%E5%B0%8B+%26+%E7%A5%9E%E9%9A%A0%E3%81%97",
    );
  });
});

describe("selectValue", () => {
  it("sets the value and resets the page", () => {
    expect(selectValue({ score: "3", page: "2" }, "score", "5")).toEqual({
      score: "5",
      page: undefined,
    });
  });

  it("clears the value when the same value is selected again", () => {
    expect(selectValue({ score: "5" }, "score", "5")).toEqual({
      score: undefined,
      page: undefined,
    });
  });
});

describe("toggleValue", () => {
  it("adds a value that is not selected", () => {
    expect(toggleValue({ genre: "drama" }, "genre", "comedy")).toEqual({
      genre: ["drama", "comedy"],
      page: undefined,
    });
  });

  it("removes a value that is already selected", () => {
    expect(
      toggleValue({ genre: ["drama", "comedy"], page: "3" }, "genre", "drama"),
    ).toEqual({ genre: ["comedy"], page: undefined });
  });

  it("starts a new list when nothing is selected", () => {
    expect(toggleValue({}, "genre", "drama")).toEqual({
      genre: ["drama"],
      page: undefined,
    });
  });
});
