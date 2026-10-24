import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  ArticleActiveFilterList,
  ArticleRecordOptions,
} from "@/components/organisms/article-filter-panel";
import ja from "@/i18n/dictionaries/ja.json";
import type { ArticleQuery } from "@/schemas/article/list";

const base: ArticleQuery = {
  recordId: undefined,
  keyword: "",
  sort: "updatedAtDesc",
  page: 1,
};

const records = [
  { recordId: "1", title: "勝手にしやがれ", releaseYear: 1960 },
  { recordId: "2", title: "軽蔑", releaseYear: 1963 },
];

function options(query: ArticleQuery, values = {}) {
  return renderToStaticMarkup(
    createElement(ArticleRecordOptions, {
      basePath: "/ja/articles",
      query,
      values,
      records,
      emptyLabel: ja.articleList.noRecords,
    }),
  );
}

function chips(query: ArticleQuery, values = {}, recordTitle?: string) {
  return renderToStaticMarkup(
    createElement(ArticleActiveFilterList, {
      basePath: "/ja/articles",
      query,
      values,
      clearHref: "/ja/articles",
      recordTitle,
      dict: ja.articleList,
    }),
  );
}

describe("ArticleRecordOptions", () => {
  it("lists the records as radio links that select the record", () => {
    const markup = options(base);
    expect(markup).toContain("勝手にしやがれ");
    expect(markup).toContain("軽蔑");
    expect(markup).toContain('href="/ja/articles?record=1"');
    expect(markup).toContain('href="/ja/articles?record=2"');
    expect(markup).toContain('role="radiogroup"');
  });

  it("marks only the selected record as checked", () => {
    const markup = options({ ...base, recordId: "2" }, { record: "2" });
    expect(markup.match(/aria-checked="true"/g)).toHaveLength(1);
  });

  it("links the selected record to the list without it, and keeps the other filters", () => {
    const markup = options(
      { ...base, recordId: "2", keyword: "音" },
      { keyword: "音", record: "2", page: "3" },
    );
    expect(markup).toContain('href="/ja/articles?keyword=%E9%9F%B3"');
    expect(markup).toContain(
      'href="/ja/articles?keyword=%E9%9F%B3&amp;record=1"',
    );
  });

  it("shows a message when there are no records", () => {
    const markup = renderToStaticMarkup(
      createElement(ArticleRecordOptions, {
        basePath: "/ja/articles",
        query: base,
        values: {},
        records: [],
        emptyLabel: ja.articleList.noRecords,
      }),
    );
    expect(markup).toContain(ja.articleList.noRecords);
    expect(markup).not.toContain("radiogroup");
  });
});

describe("ArticleActiveFilterList", () => {
  it("renders nothing without filters", () => {
    expect(chips(base)).toBe("");
  });

  it("shows the keyword as a chip that removes only the keyword", () => {
    const markup = chips(
      { ...base, keyword: "音", recordId: "2" },
      { keyword: "音", record: "2" },
      "軽蔑",
    );
    expect(markup).toContain("&quot;音&quot;");
    expect(markup).toContain('href="/ja/articles?record=2"');
  });

  it("shows the record's title as a chip that removes only the record", () => {
    const markup = chips(
      { ...base, keyword: "音", recordId: "2" },
      { keyword: "音", record: "2" },
      "軽蔑",
    );
    expect(markup).toContain("軽蔑");
    expect(markup).toContain('href="/ja/articles?keyword=%E9%9F%B3"');
  });

  it("shows an unknown record when the title is missing", () => {
    expect(chips({ ...base, recordId: "9" }, { record: "9" })).toContain(
      ja.articleList.unknownRecord,
    );
  });

  it("aligns the chips to the right, as the record list does", () => {
    const markup = chips({ ...base, keyword: "音" }, { keyword: "音" });
    expect(markup).toContain("justify-end");
  });

  it("offers to clear everything", () => {
    const markup = chips({ ...base, keyword: "音" }, { keyword: "音" });
    expect(markup).toContain(ja.articleList.clearAll);
    expect(markup).toContain('href="/ja/articles"');
  });
});
