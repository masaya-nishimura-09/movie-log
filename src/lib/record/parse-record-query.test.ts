import { describe, expect, it } from "vitest";
import {
  parseRecordQuery,
  toQueryValues,
} from "@/lib/record/parse-record-query";

describe("parseRecordQuery", () => {
  it("returns the defaults when there are no parameters", () => {
    expect(parseRecordQuery({})).toEqual({
      score: undefined,
      platform: undefined,
      moodTags: [],
      genres: [],
      keyword: "",
      sort: "watchedAtDesc",
      page: 1,
    });
  });

  it("reads every parameter", () => {
    expect(
      parseRecordQuery({
        score: "4",
        platform: "netflix",
        mood: ["moving", "dark"],
        genre: "drama",
        q: "  arrival  ",
        sort: "scoreDesc",
        page: "3",
      }),
    ).toEqual({
      score: 4,
      platform: "netflix",
      moodTags: ["moving", "dark"],
      genres: ["drama"],
      keyword: "arrival",
      sort: "scoreDesc",
      page: 3,
    });
  });

  it("drops values that are not allowed", () => {
    const query = parseRecordQuery({
      score: "9",
      platform: "unknown",
      mood: ["moving", "unknown"],
      genre: "unknown",
      sort: "unknown",
      page: "0",
    });
    expect(query).toMatchObject({
      score: undefined,
      platform: undefined,
      moodTags: ["moving"],
      genres: [],
      sort: "watchedAtDesc",
      page: 1,
    });
  });

  it("keeps the first valid score and platform", () => {
    expect(
      parseRecordQuery({
        score: ["x", "2", "5"],
        platform: ["netflix", "hulu"],
      }),
    ).toMatchObject({ score: 2, platform: "netflix" });
  });

  it("removes duplicate mood tags and genres", () => {
    expect(
      parseRecordQuery({ mood: ["dark", "dark"], genre: ["drama", "drama"] }),
    ).toMatchObject({ moodTags: ["dark"], genres: ["drama"] });
  });

  it("uses the first keyword", () => {
    expect(parseRecordQuery({ q: ["first", "second"] }).keyword).toBe("first");
  });
});

describe("toQueryValues", () => {
  it("omits the default sort and the first page", () => {
    expect(toQueryValues(parseRecordQuery({}))).toEqual({
      score: undefined,
      platform: undefined,
      mood: [],
      genre: [],
      q: "",
      sort: undefined,
      page: undefined,
    });
  });

  it("returns values that parse back to the same query", () => {
    const query = parseRecordQuery({
      score: "4",
      platform: "netflix",
      mood: ["moving", "dark"],
      genre: "drama",
      q: "arrival",
      sort: "titleAsc",
      page: "2",
    });
    expect(parseRecordQuery(toQueryValues(query))).toEqual(query);
  });
});
