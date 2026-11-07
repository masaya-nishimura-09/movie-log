import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArticleList } from "@/components/organisms/article-list";
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
  {
    dateField = "updatedAt",
    fromHref = "/ja/articles",
  }: { dateField?: "createdAt" | "updatedAt"; fromHref?: string } = {},
) {
  return renderToStaticMarkup(
    createElement(ArticleList, {
      lang: "ja",
      articles,
      dateField,
      noPosterLabel: "ポスター未登録",
      yearTemplate: "{year}年",
      fromHref,
    }),
  );
}

describe("ArticleList", () => {
  it("links each article to its page under the record that comes with it", () => {
    const markup = html([
      article("5", "感想"),
      article("6", "別の記事", { ...defaultRecord, recordId: "9" }),
    ]);
    expect(markup).toContain('href="/ja/records/2/articles/5?from=');
    expect(markup).toContain('href="/ja/records/9/articles/6?from=');
  });

  it("shows the article title, then the record title with the release year", () => {
    const markup = html([article("5", "感想")]);
    expect(markup).toContain("感想");
    expect(markup).toContain("勝手にしやがれ ・ 1960年");
    expect(markup.indexOf("感想")).toBeLessThan(
      markup.indexOf("勝手にしやがれ"),
    );
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
    expect(markup).toContain("勝手にしやがれ ・ 1960年");
    expect(markup).toContain("軽蔑 ・ 1963年");
  });

  it("shows the updated date, or the created date when the list is sorted by it", () => {
    const updated = html([article("5", "感想")]);
    expect(updated).toContain('dateTime="2026-10-02T12:00:00Z"');
    expect(updated).not.toContain('dateTime="2026-10-01T12:00:00Z"');
    const created = html([article("5", "感想")], { dateField: "createdAt" });
    expect(created).toContain('dateTime="2026-10-01T12:00:00Z"');
    expect(created).not.toContain('dateTime="2026-10-02T12:00:00Z"');
  });

  it("keeps the order of the articles", () => {
    const markup = html([article("1", "一番目"), article("2", "二番目")]);
    expect(markup.indexOf("一番目")).toBeLessThan(markup.indexOf("二番目"));
  });

  it("shows the placeholder when the record has no poster", () => {
    const markup = html([article("5", "感想")]);
    expect(markup.match(/aria-label="ポスター未登録"/g)).toHaveLength(1);
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

  it("omits the release year when it is unknown", () => {
    const markup = html([
      article("5", "感想", { ...defaultRecord, releaseYear: 0 }),
    ]);
    expect(markup).toContain(">勝手にしやがれ<");
    expect(markup).not.toContain("年");
  });

  it("passes the address of the list to the article so that it can go back to it", () => {
    const markup = html([article("5", "感想")], {
      fromHref: "/ja/articles?keyword=%E9%9F%B3&page=2",
    });
    expect(markup).toContain(
      'href="/ja/records/2/articles/5?from=%2Fja%2Farticles%3Fkeyword%3D%25E9%259F%25B3%26page%3D2"',
    );
  });

  it("passes the address of the list even when it has no filter", () => {
    expect(html([article("5", "感想")])).toContain(
      'href="/ja/records/2/articles/5?from=%2Fja%2Farticles"',
    );
  });

  it("renders no cards for no articles", () => {
    expect(html([])).not.toContain("<li");
  });

  it("escapes the titles instead of treating them as HTML", () => {
    expect(html([article("5", "<b>x</b>")])).toContain("&lt;b&gt;x&lt;/b&gt;");
  });
});
