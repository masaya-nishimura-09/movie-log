import { cache } from "react";
import { ApiError } from "@/api/client/api-error";
import { apiFetch } from "@/api/client/api-fetch";
import { isResourceId } from "@/lib/url/resource-id";
import {
  type RecordDetail,
  recordDetailResponseSchema,
} from "@/schemas/record/record";

export const getRecord = cache(async function getRecord(
  recordId: string,
): Promise<RecordDetail | undefined> {
  if (!isResourceId(recordId)) return undefined;
  try {
    return await apiFetch(
      `/records/${encodeURIComponent(recordId)}`,
      recordDetailResponseSchema,
    );
  } catch (error) {
    if (error instanceof ApiError && error.code === "RECORD_NOT_FOUND") {
      return undefined;
    }
    throw error;
  }
});
