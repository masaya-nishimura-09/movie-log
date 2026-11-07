"use server";

import { redirect } from "next/navigation";
import { type ActionResult, invalidInput } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { createRecord } from "@/api/record/create-record";
import { updateRecord } from "@/api/record/update-record";
import type { Locale } from "@/i18n/locales";
import { readRecordForm } from "@/lib/record/read-record-form";
import { recordInputSchema } from "@/schemas/record/record-input";

async function save(
  recordId: string | undefined,
  formData: FormData,
): Promise<ActionResult<string>> {
  const input = recordInputSchema.safeParse(readRecordForm(formData));
  if (!input.success) {
    return invalidInput(input.error);
  }

  try {
    const record = recordId
      ? await updateRecord(recordId, input.data)
      : await createRecord(input.data);
    return { success: true, data: record.recordId };
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
}

export async function createRecordAction(
  _previous: ActionResult<string> | undefined,
  formData: FormData,
): Promise<ActionResult<string>> {
  return save(undefined, formData);
}

export async function updateRecordAction(
  lang: Locale,
  recordId: string,
  _previous: ActionResult<never> | undefined,
  formData: FormData,
): Promise<ActionResult<never>> {
  const result = await save(recordId, formData);
  if (!result.success) return result;
  redirect(`/${lang}/records/${result.data}`);
}
