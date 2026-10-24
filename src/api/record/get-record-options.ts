import { cache } from "react";
import { getAllRecords } from "@/api/record/get-all-records";
import type { RecordOption } from "@/schemas/record/list";

export const getRecordOptions = cache(
  async function getRecordOptions(): Promise<RecordOption[]> {
    const records = await getAllRecords("title", "asc");
    return records.map(({ recordId, title, releaseYear }) => ({
      recordId,
      title,
      releaseYear,
    }));
  },
);
