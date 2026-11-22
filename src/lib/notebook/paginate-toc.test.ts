import { describe, expect, it } from "vitest";
import { paginateToc } from "@/lib/notebook/paginate-toc";

const heights = { firstPage: 200, page: 300, chapter: 50, row: 50 };

function shape(pages: ReturnType<typeof paginateToc>) {
  return pages.map((page) =>
    page.map((item) =>
      item.type === "chapter"
        ? `${item.continued ? "+" : "#"}${item.chapter}`
        : `${item.chapter}.${item.row}`,
    ),
  );
}

describe("paginateToc", () => {
  it("fills the first page less than the others", () => {
    const pages = paginateToc([{ hasHeading: false, rows: 12 }], heights);
    expect(pages.map((page) => page.length)).toEqual([4, 6, 2]);
  });

  it("counts chapter headings and repeats a heading on the next page", () => {
    const pages = paginateToc(
      [
        { hasHeading: true, rows: 2 },
        { hasHeading: true, rows: 4 },
      ],
      heights,
    );
    expect(shape(pages)).toEqual([
      ["#0", "0.0", "0.1"],
      ["#1", "1.0", "1.1", "1.2", "1.3"],
    ]);
  });

  it("carries a chapter on with a continued heading", () => {
    const pages = paginateToc([{ hasHeading: true, rows: 6 }], heights);
    expect(shape(pages)).toEqual([
      ["#0", "0.0", "0.1", "0.2"],
      ["+0", "0.3", "0.4", "0.5"],
    ]);
  });

  it("does not leave a heading alone at the bottom", () => {
    const pages = paginateToc(
      [
        { hasHeading: true, rows: 2 },
        { hasHeading: true, rows: 1 },
      ],
      { ...heights, firstPage: 210 },
    );
    expect(shape(pages)).toEqual([
      ["#0", "0.0", "0.1"],
      ["#1", "1.0"],
    ]);
  });

  it("puts at least one row on a page that is too short", () => {
    const pages = paginateToc([{ hasHeading: false, rows: 2 }], {
      ...heights,
      firstPage: 10,
      page: 10,
    });
    expect(pages.map((page) => page.length)).toEqual([1, 1]);
  });

  it("keeps one empty page when there is nothing to list", () => {
    expect(paginateToc([], heights)).toEqual([[]]);
  });
});
