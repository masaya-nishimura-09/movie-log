"use server";

import { refresh } from "next/cache";
import type { ActionResult } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { addRecordAttachment } from "@/api/record/add-record-attachment";
import { deleteRecordAttachment } from "@/api/record/delete-record-attachment";
import { posterContentTypes, posterMaxBytes } from "@/schemas/media/media";

export async function addAttachmentAction(
  recordId: string,
  formData: FormData,
): Promise<ActionResult<null>> {
  const file = formData.get("file");
  if (
    !(file instanceof File) ||
    file.size === 0 ||
    file.size > posterMaxBytes ||
    !posterContentTypes.includes(file.type)
  ) {
    return { success: false, messageKey: "attachmentsUploadError" };
  }

  try {
    await addRecordAttachment(recordId, file);
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, messageKey: "attachmentsUploadError" };
    }
    throw error;
  }
  refresh();
  return { success: true, data: null };
}

export async function deleteAttachmentAction(
  recordId: string,
  attachmentId: string,
): Promise<ActionResult<null>> {
  try {
    await deleteRecordAttachment(recordId, attachmentId);
  } catch (error) {
    const gone =
      error instanceof ApiError && error.code === "ATTACHMENT_NOT_FOUND";
    if (!gone && error instanceof ApiError) {
      return { success: false, messageKey: "unexpectedError" };
    }
    if (!gone) throw error;
  }
  refresh();
  return { success: true, data: null };
}
