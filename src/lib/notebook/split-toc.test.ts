import { describe, expect, it } from "vitest";
import { splitToc, tocItems } from "@/lib/notebook/split-toc";

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

describe("splitToc", () => {
  it("keeps everything on the left page when it fits", () => {
    const { left, right } = splitToc([{ hasHeading: true, rows: 3 }], 8);
    expect(left).toHaveLength(4);
    expect(right).toEqual([]);
  });

  it("repeats the heading on the right page when a chapter continues", () => {
    const { left, right } = splitToc([{ hasHeading: true, rows: 5 }], 4);
    expect(left).toHaveLength(4);
    expect(right).toEqual([
      { type: "chapter", chapter: 0, continued: true },
      { type: "row", chapter: 0, row: 3 },
      { type: "row", chapter: 0, row: 4 },
    ]);
  });

  it("moves a heading at the bottom of the left page to the right page", () => {
    const { left, right } = splitToc(
      [
        { hasHeading: true, rows: 2 },
        { hasHeading: true, rows: 2 },
      ],
      4,
    );
    expect(left).toHaveLength(3);
    expect(right[0]).toEqual({ type: "chapter", chapter: 1, continued: false });
  });

  it("does not repeat a heading for chapters without one", () => {
    const { right } = splitToc([{ hasHeading: false, rows: 5 }], 3);
    expect(right).toEqual([
      { type: "row", chapter: 0, row: 3 },
      { type: "row", chapter: 0, row: 4 },
    ]);
  });
});
