import { type TocItem, tocItems } from "@/lib/notebook/split-toc";

type ChapterShape = { hasHeading: boolean; rows: number };

export type TocHeights = {
  firstPage: number;
  page: number;
  chapter: number;
  row: number;
};

export function paginateToc(
  chapters: ChapterShape[],
  heights: TocHeights,
): TocItem[][] {
  const items = tocItems(chapters);
  const pages: TocItem[][] = [];
  let next = 0;
  while (next < items.length) {
    const room = pages.length === 0 ? heights.firstPage : heights.page;
    const page: TocItem[] = [];
    let used = 0;
    let rows = 0;
    const first = items[next];
    if (first?.type === "row" && chapters[first.chapter]?.hasHeading) {
      page.push({ type: "chapter", chapter: first.chapter, continued: true });
      used += heights.chapter;
    }
    while (next < items.length) {
      const item = items[next];
      if (!item) break;
      const needed =
        item.type === "chapter" ? heights.chapter + heights.row : heights.row;
      if (rows > 0 && used + needed > room) break;
      page.push(item);
      used += item.type === "chapter" ? heights.chapter : heights.row;
      if (item.type === "row") rows += 1;
      next += 1;
    }
    pages.push(page);
  }
  return pages.length > 0 ? pages : [[]];
}
