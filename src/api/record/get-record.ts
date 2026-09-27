import { mockRecords } from "@/api/record/mock-records";
import type { MovieRecord } from "@/schemas/record/record";

export async function getRecord(
  recordId: string,
): Promise<MovieRecord | undefined> {
  return mockRecords.find((record) => record.recordId === recordId);
}
