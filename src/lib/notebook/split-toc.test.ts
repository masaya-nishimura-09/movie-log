import { describe, expect, it } from "vitest";
import { tocItems } from "@/lib/notebook/split-toc";

describe("tocItems", () => {
  it("puts each chapter heading before its rows", () => {
    expect(
      tocItems([
        { hasHeading: true, rows: 2 },
        { hasHeading: true, rows: 1 },
      ]),
    ).toEqual([
      { type: "chapter", chapter: 0, continued: false },
      { type: "row", chapter: 0, row: 0 },
      { type: "row", chapter: 0, row: 1 },
      { type: "chapter", chapter: 1, continued: false },
      { type: "row", chapter: 1, row: 0 },
    ]);
  });

  it("lists only rows for a chapter without a heading", () => {
    expect(tocItems([{ hasHeading: false, rows: 2 }])).toEqual([
      { type: "row", chapter: 0, row: 0 },
      { type: "row", chapter: 0, row: 1 },
    ]);
  });
});
