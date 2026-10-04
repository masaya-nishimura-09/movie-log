import { initialRecordsEn } from "@/api/mock/mock-records-en";
import { initialRecordsJa } from "@/api/mock/mock-records-ja";
import type { RecordResponse } from "@/schemas/record/record";

const initialRecords: RecordResponse[] =
  process.env.MOCK_LANGUAGE === "en" ? initialRecordsEn : initialRecordsJa;

const store = globalThis as { mockRecords?: RecordResponse[] };
store.mockRecords ??= initialRecords;
export const mockRecords = store.mockRecords;
