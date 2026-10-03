"use server";

import type { ActionResult } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { uploadPoster } from "@/api/media/upload-poster";
import { posterContentTypes, posterMaxBytes } from "@/schemas/media/media";

export async function uploadPosterAction(
  formData: FormData,
): Promise<ActionResult<string>> {
  const file = formData.get("file");
  if (
    !(file instanceof File) ||
    file.size === 0 ||
    file.size > posterMaxBytes ||
    !posterContentTypes.includes(file.type)
  ) {
    return { success: false, messageKey: "posterUploadError" };
  }

  try {
    return { success: true, data: await uploadPoster(file) };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, messageKey: "posterUploadError" };
    }
    throw error;
  }
}
