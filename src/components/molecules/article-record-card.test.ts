import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArticleRecordCard } from "@/components/molecules/article-record-card";

function html(props: Partial<Parameters<typeof ArticleRecordCard>[0]> = {}) {
  return renderToStaticMarkup(
    createElement(ArticleRecordCard, {
      href: "/ja/records/1",
      title: "勝手にしやがれ",
      posterUrl: "",
      noPosterLabel: "ポスター未登録",
      year: "1960年",
      ...props,
    }),
  );
}

describe("ArticleRecordCard", () => {
  it("links to the record with its title and release year", () => {
    const markup = html();
    expect(markup).toContain('href="/ja/records/1"');
    expect(markup).toContain("勝手にしやがれ");
    expect(markup).toContain("1960年");
  });

  it("shows only the poster, the title and the release year", () => {
    const markup = html();
    expect(markup).not.toContain('role="img" aria-label="スコア');
    expect(markup).not.toContain("<time");
    expect(markup).not.toContain("border-dashed");
    expect(markup).not.toContain("bg-card");
  });

  it("shows the placeholder with its label when the record has no poster", () => {
    const markup = html({ posterUrl: "" });
    expect(markup).toContain('aria-label="ポスター未登録"');
    expect(markup).not.toContain("<img");
  });

  it("shows the poster image when the record has one", () => {
    const markup = html({ posterUrl: "/mock-posters/01-ja.webp" });
    expect(markup).toContain("<img");
    expect(markup).not.toContain('aria-label="ポスター未登録"');
  });

  it("omits the release year when there is none", () => {
    expect(html({ year: "" })).not.toContain("1960年");
  });

  it("escapes the title instead of treating it as HTML", () => {
    expect(html({ title: "<script>x</script>" })).toContain(
      "&lt;script&gt;x&lt;/script&gt;",
    );
  });

  it("adds the given class", () => {
    expect(html({ className: "xl:hidden" })).toContain("xl:hidden");
  });
});
