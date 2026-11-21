export type TocItem =
  | { type: "chapter"; chapter: number; continued: boolean }
  | { type: "row"; chapter: number; row: number };

type ChapterShape = { hasHeading: boolean; rows: number };

export function tocItems(chapters: ChapterShape[]): TocItem[] {
  return chapters.flatMap((chapter, index) => [
    ...(chapter.hasHeading
      ? [{ type: "chapter" as const, chapter: index, continued: false }]
      : []),
    ...Array.from({ length: chapter.rows }, (_, row) => ({
      type: "row" as const,
      chapter: index,
      row,
    })),
  ]);
}

export function splitToc(
  chapters: ChapterShape[],
  leftSlots: number,
): { left: TocItem[]; right: TocItem[] } {
  const items = tocItems(chapters);
  let cut = Math.min(leftSlots, items.length);
  if (cut < items.length && items[cut - 1]?.type === "chapter") cut -= 1;
  const left = items.slice(0, cut);
  const right = items.slice(cut);
  const first = right[0];
  if (first?.type === "row" && chapters[first.chapter]?.hasHeading) {
    right.unshift({ type: "chapter", chapter: first.chapter, continued: true });
  }
  return { left, right };
}
