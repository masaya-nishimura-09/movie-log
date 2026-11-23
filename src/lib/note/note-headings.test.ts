import { describe, expect, it } from "vitest";
import { noteHeadings } from "@/lib/note/note-headings";

describe("noteHeadings", () => {
  it("lists the headings with their block and level", () => {
    expect(
      noteHeadings([
        { type: "paragraph", content: [{ type: "text", text: "前置き" }] },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [
            { type: "text", text: "街の" },
            { type: "text", text: "撮影", marks: [{ type: "bold" }] },
          ],
        },
        {
          type: "heading",
          attrs: { level: 3 },
          content: [{ type: "text", text: "カメラ" }],
        },
      ]),
    ).toEqual([
      { block: 1, level: 2, text: "街の撮影" },
      { block: 2, level: 3, text: "カメラ" },
    ]);
  });

  it("skips empty headings", () => {
    expect(
      noteHeadings([{ type: "heading", attrs: { level: 2 }, content: [] }]),
    ).toEqual([]);
  });
});
