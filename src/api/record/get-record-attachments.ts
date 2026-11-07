import { ApiError } from "@/api/client/api-error";
import { apiFetch } from "@/api/client/api-fetch";
import { isResourceId } from "@/lib/url/resource-id";
import {
  type Attachment,
  attachmentListResponseSchema,
} from "@/schemas/record/attachment";

export async function getRecordAttachments(
  recordId: string,
): Promise<Attachment[]> {
  if (!isResourceId(recordId)) return [];
  try {
    return await apiFetch(
      `/records/${encodeURIComponent(recordId)}/attachments`,
      attachmentListResponseSchema,
    );
  } catch (error) {
    if (error instanceof ApiError && error.code === "RECORD_NOT_FOUND") {
      return [];
    }
    throw error;
  }
}
