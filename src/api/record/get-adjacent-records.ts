import { mockRecords } from "@/api/record/mock-records";
import type { MovieRecord } from "@/schemas/record/record";

type AdjacentRecords = {
  newer: MovieRecord | undefined;
  older: MovieRecord | undefined;
};

export async function getAdjacentRecords(
  recordId: string,
): Promise<AdjacentRecords> {
  const sorted = mockRecords.toSorted((a, b) =>
    b.watchedAt.localeCompare(a.watchedAt),
  );
  const index = sorted.findIndex((record) => record.recordId === recordId);
  return { newer: sorted[index - 1], older: sorted[index + 1] };
}
