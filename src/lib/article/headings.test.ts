import { describe, expect, it } from "vitest";
import { extractHeadings, firstParagraphText } from "@/lib/article/headings";

const heading = (text: string, level = 2) => ({
  type: "heading",
  attrs: { level },
  content: [{ type: "text", text }],
});

describe("extractHeadings", () => {
  it("returns the headings in document order with their level and text", () => {
    const headings = extractHeadings({
      type: "doc",
      content: [
        heading("はじめに"),
        { type: "paragraph", content: [{ type: "text", text: "本文" }] },
        heading("詳細", 3),
        heading("おわりに"),
      ],
    });
    expect(
      headings.map(({ id, level, text }) => ({ id, level, text })),
    ).toEqual([
      { id: "section-1", level: 2, text: "はじめに" },
      { id: "section-2", level: 3, text: "詳細" },
      { id: "section-3", level: 2, text: "おわりに" },
    ]);
  });

  it("keeps the heading nodes themselves", () => {
    const first = heading("はじめに");
    const [found] = extractHeadings({ type: "doc", content: [first] });
    expect(found?.node).toBe(first);
  });

  it("joins the text of marked parts", () => {
    const [found] = extractHeadings({
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [
            { type: "text", text: "太い", marks: [{ type: "bold" }] },
            { type: "text", text: "見出し" },
          ],
        },
      ],
    });
    expect(found?.text).toBe("太い見出し");
  });

  it("finds headings nested in other nodes", () => {
    const headings = extractHeadings({
      type: "doc",
      content: [{ type: "blockquote", content: [heading("引用の中")] }],
    });
    expect(headings.map((h) => h.text)).toEqual(["引用の中"]);
  });

  it("skips empty headings without leaving gaps in the IDs", () => {
    const headings = extractHeadings({
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 } },
        heading("   "),
        heading("見出し"),
      ],
    });
    expect(headings.map(({ id, text }) => ({ id, text }))).toEqual([
      { id: "section-1", text: "見出し" },
    ]);
  });

  it("treats a level other than 3 as level 2", () => {
    const [found] = extractHeadings({
      type: "doc",
      content: [heading("見出し", 1)],
    });
    expect(found?.level).toBe(2);
  });

  it("returns nothing for a document without headings", () => {
    expect(extractHeadings({ type: "doc" })).toEqual([]);
    expect(
      extractHeadings({
        type: "doc",
        content: [{ type: "paragraph" }],
      }),
    ).toEqual([]);
  });
});

describe("firstParagraphText", () => {
  it("returns the text of the first paragraph that has text, skipping headings", () => {
    expect(
      firstParagraphText({
        type: "doc",
        content: [
          heading("見出し"),
          { type: "paragraph" },
          {
            type: "paragraph",
            content: [
              { type: "text", text: "太い", marks: [{ type: "bold" }] },
              { type: "text", text: "本文" },
            ],
          },
          { type: "paragraph", content: [{ type: "text", text: "次" }] },
        ],
      }),
    ).toBe("太い本文");
  });

  it("finds a paragraph inside a list or a quote", () => {
    expect(
      firstParagraphText({
        type: "doc",
        content: [
          {
            type: "blockquote",
            content: [
              { type: "paragraph", content: [{ type: "text", text: "引用" }] },
            ],
          },
        ],
      }),
    ).toBe("引用");
  });

  it("returns an empty string when there is no text", () => {
    expect(
      firstParagraphText({ type: "doc", content: [heading("だけ")] }),
    ).toBe("");
  });
});
