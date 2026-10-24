import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArticleList } from "@/components/organisms/article-list";
import ja from "@/i18n/dictionaries/ja.json";
import type { ArticleRecord, ArticleSummary } from "@/schemas/article/article";

const defaultRecord: ArticleRecord = {
  recordId: "2",
  title: "勝手にしやがれ",
  posterUrl: "",
  releaseYear: 1960,
};

const article = (
  id: string,
  title: string,
  record: ArticleRecord = defaultRecord,
): ArticleSummary => ({
  articleId: id,
  record,
  title,
  createdAt: "2026-10-01T12:00:00Z",
  updatedAt: "2026-10-02T12:00:00Z",
});

function html(
  articles: ArticleSummary[],
  startIndex = 0,
  fromHref = "/ja/articles",
) {
  return renderToStaticMarkup(
    createElement(ArticleList, {
      lang: "ja",
      articles,
      startIndex,
      dict: ja.articleList,
      noPosterLabel: "ポスター未登録",
      yearTemplate: "{year}年",
      fromHref,
    }),
  );
}

describe("ArticleList", () => {
  it("shows the column headers", () => {
    const markup = html([article("5", "感想")]);
    for (const label of [
      ja.articleList.columnIndex,
      ja.articleList.columnTitle,
      ja.articleList.columnRecord,
      ja.articleList.columnCreatedAt,
      ja.articleList.columnUpdatedAt,
    ]) {
      expect(markup).toContain(`>${label}<`);
    }
  });

  it("links each article to its page under the record that comes with it", () => {
    const markup = html([
      article("5", "感想"),
      article("6", "別の記事", { ...defaultRecord, recordId: "9" }),
    ]);
    expect(markup).toContain('href="/ja/records/2/articles/5?from=');
    expect(markup).toContain('href="/ja/records/9/articles/6?from=');
  });

  it("shows the article title, the record title and the release year", () => {
    const markup = html([article("5", "感想")]);
    expect(markup).toContain("感想");
    expect(markup).toContain("勝手にしやがれ");
    expect(markup).toContain("1960年");
  });

  it("shows each article's own record", () => {
    const markup = html([
      article("5", "一つ目"),
      article("6", "二つ目", {
        recordId: "9",
        title: "軽蔑",
        posterUrl: "",
        releaseYear: 1963,
      }),
    ]);
    expect(markup).toContain("勝手にしやがれ");
    expect(markup).toContain("軽蔑");
    expect(markup).toContain("1963年");
  });

  it("shows the created and updated dates", () => {
    const markup = html([article("5", "感想")]);
    expect(markup).toContain('dateTime="2026-10-01T12:00:00Z"');
    expect(markup).toContain('dateTime="2026-10-02T12:00:00Z"');
  });

  it("numbers the rows from the given start index", () => {
    const markup = html([article("1", "一番目"), article("2", "二番目")], 20);
    expect(markup).toContain(">21<");
    expect(markup).toContain(">22<");
    expect(markup).not.toContain(">1<");
  });

  it("keeps the order of the articles", () => {
    const markup = html([article("1", "一番目"), article("2", "二番目")]);
    expect(markup.indexOf("一番目")).toBeLessThan(markup.indexOf("二番目"));
  });

  it("shows the placeholder when the record has no poster", () => {
    const markup = html([article("5", "感想")]);
    expect(markup).toContain('aria-label="ポスター未登録"');
    expect(markup).not.toContain("<img");
  });

  it("shows the poster of the record when it has one", () => {
    const markup = html([
      article("5", "感想", {
        ...defaultRecord,
        posterUrl: "/mock-posters/01-ja.webp",
      }),
    ]);
    expect(markup).toContain("<img");
    expect(markup).not.toContain('aria-label="ポスター未登録"');
  });

  it("shows the poster on both layouts, next to the record and never next to the article title", () => {
    const markup = html([article("5", "感想")]);
    expect(markup.match(/aria-label="ポスター未登録"/g)).toHaveLength(2);
    const titleStart = markup.lastIndexOf("<span", markup.indexOf("感想"));
    expect(markup.slice(0, titleStart).lastIndexOf("ポスター未登録")).toBe(-1);
  });

  it("omits the release year when it is unknown", () => {
    const markup = html([
      article("5", "感想", { ...defaultRecord, releaseYear: 0 }),
    ]);
    expect(markup).not.toContain("年");
  });

  it("hides the row number on narrow screens and shows it from the md width", () => {
    const markup = html([article("5", "感想")]);
    expect(markup).toMatch(/class="hidden[^"]*md:block[^"]*">1</);
  });

  it("puts the release year with the record, not under the article title", () => {
    const markup = html([article("5", "感想")]);
    const titleEnd = markup.indexOf("感想");
    const firstRecord = markup.indexOf("勝手にしやがれ");
    const firstYear = markup.indexOf("1960年");
    expect(firstRecord).toBeGreaterThan(titleEnd);
    expect(firstYear).toBeGreaterThan(firstRecord);
    expect(
      markup.slice(titleEnd, markup.indexOf("</span>", titleEnd)),
    ).not.toContain("年");
  });

  it("shows the updated date with the article title on narrow screens", () => {
    expect(html([article("5", "感想")])).toMatch(
      /md:hidden[^>]*><time[^>]*dateTime="2026-10-02T12:00:00Z"/,
    );
  });

  it("passes the address of the list to the article so that it can go back to it", () => {
    const markup = html(
      [article("5", "感想")],
      0,
      "/ja/articles?keyword=%E9%9F%B3&page=2",
    );
    expect(markup).toContain(
      'href="/ja/records/2/articles/5?from=%2Fja%2Farticles%3Fkeyword%3D%25E9%259F%25B3%26page%3D2"',
    );
  });

  it("passes the address of the list even when it has no filter", () => {
    expect(html([article("5", "感想")])).toContain(
      'href="/ja/records/2/articles/5?from=%2Fja%2Farticles"',
    );
  });

  it("renders only the header for no articles", () => {
    expect(html([])).not.toContain("<li");
  });

  it("escapes the titles instead of treating them as HTML", () => {
    expect(html([article("5", "<b>x</b>")])).toContain("&lt;b&gt;x&lt;/b&gt;");
  });
});
