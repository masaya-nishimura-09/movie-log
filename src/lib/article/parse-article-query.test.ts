import { describe, expect, it } from "vitest";
import {
  articleQueryKeys,
  parseArticleQuery,
  toArticleQueryValues,
} from "@/lib/article/parse-article-query";

describe("parseArticleQuery", () => {
  it("uses the defaults when there are no parameters", () => {
    expect(parseArticleQuery({})).toEqual({
      recordId: undefined,
      keyword: "",
      sort: "updatedAtDesc",
      page: 1,
    });
  });

  it("reads every parameter", () => {
    expect(
      parseArticleQuery({
        keyword: "音",
        record: "12",
        sort: "titleAsc",
        page: "3",
      }),
    ).toEqual({ recordId: "12", keyword: "音", sort: "titleAsc", page: 3 });
  });

  it("trims the keyword and cuts it at 255 characters", () => {
    expect(parseArticleQuery({ keyword: "  音  " }).keyword).toBe("音");
    expect(
      parseArticleQuery({ keyword: "あ".repeat(300) }).keyword,
    ).toHaveLength(255);
  });

  it("takes the first value when a parameter is repeated", () => {
    expect(
      parseArticleQuery({ keyword: ["一つ目", "二つ目"], record: ["1", "2"] }),
    ).toMatchObject({ keyword: "一つ目", recordId: "1" });
  });

  it("ignores an invalid record, sort or page", () => {
    expect(
      parseArticleQuery({ record: "abc", sort: "scoreDesc", page: "0" }),
    ).toEqual({
      recordId: undefined,
      keyword: "",
      sort: "updatedAtDesc",
      page: 1,
    });
    expect(parseArticleQuery({ record: "0" }).recordId).toBeUndefined();
    expect(parseArticleQuery({ record: "-3" }).recordId).toBeUndefined();
    expect(parseArticleQuery({ record: "1.5" }).recordId).toBeUndefined();
    expect(parseArticleQuery({ page: "2.5" }).page).toBe(1);
    expect(parseArticleQuery({ page: "x" }).page).toBe(1);
  });
});

describe("toArticleQueryValues", () => {
  it("omits the defaults", () => {
    expect(
      toArticleQueryValues({
        recordId: undefined,
        keyword: "",
        sort: "updatedAtDesc",
        page: 1,
      }),
    ).toEqual({
      [articleQueryKeys.keyword]: "",
      [articleQueryKeys.record]: undefined,
      [articleQueryKeys.sort]: undefined,
      [articleQueryKeys.page]: undefined,
    });
  });

  it("keeps the values that differ from the defaults", () => {
    expect(
      toArticleQueryValues({
        recordId: "2",
        keyword: "音",
        sort: "createdAtAsc",
        page: 4,
      }),
    ).toEqual({
      keyword: "音",
      record: "2",
      sort: "createdAtAsc",
      page: "4",
    });
  });
});
