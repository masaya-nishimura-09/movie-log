import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArticleBody } from "@/components/molecules/article-body";

function html(content: object) {
  return renderToStaticMarkup(createElement(ArticleBody, { content }))
    .replace(/^<div[^>]*>/, "")
    .replace(/<\/div>$/, "");
}

const text = (value: string, marks?: { type: string }[]) => ({
  type: "text",
  text: value,
  ...(marks ? { marks } : {}),
});

describe("ArticleBody", () => {
  it("renders paragraphs", () => {
    expect(
      html({
        type: "doc",
        content: [{ type: "paragraph", content: [text("本文")] }],
      }),
    ).toBe("<p>本文</p>");
  });

  it("renders an empty paragraph as a blank line", () => {
    expect(html({ type: "doc", content: [{ type: "paragraph" }] })).toBe(
      "<p><br/></p>",
    );
  });

  it("renders headings of level 2 and 3", () => {
    expect(
      html({
        type: "doc",
        content: [
          { type: "heading", attrs: { level: 2 }, content: [text("見出し")] },
          { type: "heading", attrs: { level: 3 }, content: [text("小見出し")] },
        ],
      }),
    ).toBe('<h2 id="section-1">見出し</h2><h3 id="section-2">小見出し</h3>');
  });

  it("renders bold and italic marks, nested in the order given", () => {
    expect(
      html({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              text("太", [{ type: "bold" }]),
              text("斜", [{ type: "italic" }]),
              text("両方", [{ type: "bold" }, { type: "italic" }]),
            ],
          },
        ],
      }),
    ).toBe(
      "<p><strong>太</strong><em>斜</em><em><strong>両方</strong></em></p>",
    );
  });

  it("gives the headings the IDs of the table of contents, skipping empty ones", () => {
    expect(
      html({
        type: "doc",
        content: [
          { type: "heading", attrs: { level: 2 } },
          { type: "heading", attrs: { level: 2 }, content: [text("一つ目")] },
          { type: "paragraph", content: [text("本文")] },
          { type: "heading", attrs: { level: 3 }, content: [text("二つ目")] },
        ],
      }),
    ).toBe(
      '<h2></h2><h2 id="section-1">一つ目</h2><p>本文</p><h3 id="section-2">二つ目</h3>',
    );
  });

  it("renders bullet and ordered lists", () => {
    const item = (value: string) => ({
      type: "listItem",
      content: [{ type: "paragraph", content: [text(value)] }],
    });
    expect(
      html({
        type: "doc",
        content: [
          { type: "bulletList", content: [item("a"), item("b")] },
          { type: "orderedList", content: [item("c")] },
        ],
      }),
    ).toBe(
      "<ul><li><p>a</p></li><li><p>b</p></li></ul><ol><li><p>c</p></li></ol>",
    );
  });

  it("renders blockquotes and hard breaks", () => {
    expect(
      html({
        type: "doc",
        content: [
          {
            type: "blockquote",
            content: [
              {
                type: "paragraph",
                content: [text("引用"), { type: "hardBreak" }, text("続き")],
              },
            ],
          },
        ],
      }),
    ).toBe("<blockquote><p>引用<br/>続き</p></blockquote>");
  });

  it("escapes text instead of treating it as HTML", () => {
    expect(
      html({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [text('<script>alert("x")</script>')],
          },
        ],
      }),
    ).toBe("<p>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;</p>");
  });

  it("renders only the children of an unknown node and ignores unknown marks", () => {
    expect(
      html({
        type: "doc",
        content: [
          {
            type: "codeBlock",
            content: [text("code", [{ type: "link" }])],
          },
        ],
      }),
    ).toBe("code");
  });

  it("renders an empty document as nothing", () => {
    expect(html({ type: "doc" })).toBe("");
  });
});
