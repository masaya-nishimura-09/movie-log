import { ApiError } from "@/api/client/api-error";
import { apiFetch } from "@/api/client/api-fetch";
import {
  type MovieRecord,
  recordResponseSchema,
} from "@/schemas/record/record";

export async function getRecord(
  recordId: string,
): Promise<MovieRecord | undefined> {
  try {
    return await apiFetch(
      `/records/${encodeURIComponent(recordId)}`,
      recordResponseSchema,
    );
  } catch (error) {
    if (error instanceof ApiError && error.code === "RECORD_NOT_FOUND") {
      return undefined;
    }
    throw error;
  }
}
