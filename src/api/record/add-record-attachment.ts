import { apiFetch } from "@/api/client/api-fetch";
import {
  type Attachment,
  attachmentResponseSchema,
} from "@/schemas/record/attachment";

export async function addRecordAttachment(
  recordId: string,
  file: File,
): Promise<Attachment> {
  const body = new FormData();
  body.set("file", file);
  return apiFetch(
    `/records/${encodeURIComponent(recordId)}/attachments`,
    attachmentResponseSchema,
    { method: "POST", body },
  );
}
