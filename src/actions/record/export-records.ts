"use server";

import type { ActionResult } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { getAllRecords } from "@/api/record/get-all-records";
import type { MovieRecord } from "@/schemas/record/record";

export async function exportRecordsAction(): Promise<
  ActionResult<MovieRecord[]>
> {
  try {
    return { success: true, data: await getAllRecords("watched_at", "desc") };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, messageKey: "exportFailed" };
    }
    throw error;
  }
}
