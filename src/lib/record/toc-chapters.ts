import type { RecordSort } from "@/schemas/record/list";
import type { MovieRecord } from "@/schemas/record/record";

export type TocHeading =
  | { kind: "month"; year: number; month: number }
  | { kind: "score"; score: number }
  | { kind: "year"; year: number };

export type TocChapter = {
  key: string;
  heading: TocHeading | null;
  records: MovieRecord[];
};

function headingFor(
  record: MovieRecord,
  sort: RecordSort,
  timeZone: string,
): TocHeading | null {
  if (sort === "scoreDesc") return { kind: "score", score: record.score };
  if (sort === "releaseYearDesc")
    return { kind: "year", year: record.releaseYear };
  if (sort === "titleAsc") return null;
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "numeric",
  }).formatToParts(new Date(record.watchedAt));
  const part = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value);
  return { kind: "month", year: part("year"), month: part("month") };
}

export function tocChapters(
  records: MovieRecord[],
  sort: RecordSort,
  timeZone: string,
): TocChapter[] {
  const chapters: TocChapter[] = [];
  for (const record of records) {
    const heading = headingFor(record, sort, timeZone);
    const key = JSON.stringify(heading);
    const last = chapters.at(-1);
    if (last?.key === key) last.records.push(record);
    else chapters.push({ key, heading, records: [record] });
  }
  return chapters;
}
