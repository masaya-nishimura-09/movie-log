"use server";

import type { ActionResult } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { getAllRecordsWithNotes } from "@/api/record/get-all-records-with-notes";
import type { RecordDetail } from "@/schemas/record/record";

export async function exportNotesAction(): Promise<
  ActionResult<RecordDetail[]>
> {
  try {
    return { success: true, data: await getAllRecordsWithNotes() };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, messageKey: "exportFailed" };
    }
    throw error;
  }
}
