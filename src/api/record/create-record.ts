import { apiFetch } from "@/api/client/api-fetch";
import { jsonBody } from "@/api/client/request-json";
import {
  type MovieRecord,
  recordResponseSchema,
} from "@/schemas/record/record";
import {
  type RecordInput,
  toRecordRequest,
} from "@/schemas/record/record-input";

export async function createRecord(input: RecordInput): Promise<MovieRecord> {
  return apiFetch(
    "/records/",
    recordResponseSchema,
    jsonBody(toRecordRequest(input)),
  );
}
