import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SearchForm } from "@/components/molecules/search-form";

function html(props: Partial<Parameters<typeof SearchForm>[0]> = {}) {
  return renderToStaticMarkup(
    createElement(SearchForm, {
      action: "/ja/articles",
      name: "keyword",
      keyword: "",
      hidden: {},
      label: "タイトルと本文で検索",
      placeholder: "タイトルと本文で検索",
      ...props,
    }),
  );
}

describe("SearchForm", () => {
  it("submits the keyword under the given name to the given path", () => {
    const markup = html({ keyword: "音" });
    expect(markup).toContain('action="/ja/articles"');
    expect(markup).toContain('name="keyword"');
    expect(markup).not.toContain('name="q"');
    expect(markup).toContain('value="音"');
    expect(markup).toContain('aria-label="タイトルと本文で検索"');
    expect(markup).toContain('placeholder="タイトルと本文で検索"');
  });

  it("keeps the other filters in hidden fields, leaving out the empty ones", () => {
    const markup = html({
      hidden: { record: "3", sort: undefined, extra: "" },
    });
    expect(markup).toContain('type="hidden" name="record" value="3"');
    expect(markup).not.toContain('name="sort"');
    expect(markup).not.toContain('name="extra"');
  });

  it("limits the keyword only when a maximum length is given", () => {
    expect(html({ maxLength: 255 })).toContain('maxLength="255"');
    expect(html()).not.toContain("maxLength");
  });

  it("leaves out the hidden fields when none are given", () => {
    expect(html({ hidden: undefined })).not.toContain('type="hidden"');
  });

  it("escapes the keyword instead of treating it as HTML", () => {
    expect(html({ keyword: '"><script>' })).toContain(
      "&quot;&gt;&lt;script&gt;",
    );
  });
});
