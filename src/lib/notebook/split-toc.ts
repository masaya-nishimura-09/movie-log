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
