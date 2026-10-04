import { demoRecordsEn } from "@/api/mock/mock-records-demo-en";
import { demoRecordsJa } from "@/api/mock/mock-records-demo-ja";
import { initialRecordsEn } from "@/api/mock/mock-records-en";
import { initialRecordsJa } from "@/api/mock/mock-records-ja";
import type { RecordResponse } from "@/schemas/record/record";

const english = process.env.MOCK_LANGUAGE === "en";
const demo = process.env.MOCK_DATASET === "demo";

const initialRecords: RecordResponse[] = demo
  ? english
    ? demoRecordsEn
    : demoRecordsJa
  : english
    ? initialRecordsEn
    : initialRecordsJa;

const store = globalThis as { mockRecords?: RecordResponse[] };
store.mockRecords ??= initialRecords;
export const mockRecords = store.mockRecords;
