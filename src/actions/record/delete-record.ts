"use server";

import { redirect } from "next/navigation";
import type { ActionResult } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { deleteRecord } from "@/api/record/delete-record";
import type { Locale } from "@/i18n/locales";

export async function deleteRecordAction(
  lang: Locale,
  recordId: string,
): Promise<ActionResult<never>> {
  try {
    await deleteRecord(recordId);
  } catch (error) {
    const gone = error instanceof ApiError && error.code === "RECORD_NOT_FOUND";
    if (!gone && error instanceof ApiError) {
      return { success: false, messageKey: "unexpectedError" };
    }
    if (!gone) throw error;
  }
  redirect(`/${lang}/records`);
}
