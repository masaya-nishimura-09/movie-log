import type { MovieRecord } from "@/schemas/record/record";

type MonthGroup = {
  key: string;
  firstWatchedAt: string;
  records: MovieRecord[];
};

export function groupByMonth(records: MovieRecord[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  for (const record of records) {
    const key = record.watchedAt.slice(0, 7);
    const last = groups.at(-1);
    if (last?.key === key) {
      last.records.push(record);
    } else {
      groups.push({ key, firstWatchedAt: record.watchedAt, records: [record] });
    }
  }
  return groups;
}
