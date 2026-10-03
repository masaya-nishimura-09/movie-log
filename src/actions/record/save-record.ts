"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { ActionResult } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { createRecord } from "@/api/record/create-record";
import { updateRecord } from "@/api/record/update-record";
import type { Locale } from "@/i18n/locales";
import { readRecordForm } from "@/lib/record/read-record-form";
import { recordInputSchema } from "@/schemas/record/record-input";

type RecordActionResult = ActionResult<never> | undefined;

async function save(
  lang: Locale,
  recordId: string | undefined,
  formData: FormData,
): Promise<ActionResult<never>> {
  const input = recordInputSchema.safeParse(readRecordForm(formData));
  if (!input.success) {
    return {
      success: false,
      messageKey: "invalidInput",
      errors: z.flattenError(input.error).fieldErrors,
    };
  }

  let savedId: string;
  try {
    const record = recordId
      ? await updateRecord(recordId, input.data)
      : await createRecord(input.data);
    savedId = record.recordId;
  } catch (error) {
    if (error instanceof ApiError && error.code === "RECORD_NOT_FOUND") {
      return { success: false, messageKey: "notFound" };
    }
    if (error instanceof ApiError && error.code === "INVALID_INPUT") {
      return { success: false, messageKey: "invalidInput" };
    }
    if (error instanceof ApiError) {
      return { success: false, messageKey: "unexpectedError" };
    }
    throw error;
  }
  redirect(`/${lang}/records/${savedId}`);
}

export async function createRecordAction(
  lang: Locale,
  _previous: RecordActionResult,
  formData: FormData,
): Promise<ActionResult<never>> {
  return save(lang, undefined, formData);
}

export async function updateRecordAction(
  lang: Locale,
  recordId: string,
  _previous: RecordActionResult,
  formData: FormData,
): Promise<ActionResult<never>> {
  return save(lang, recordId, formData);
}
