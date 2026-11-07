import { z } from "zod";
import { apiFetch } from "@/api/client/api-fetch";

export async function deleteRecordAttachment(
  recordId: string,
  attachmentId: string,
): Promise<void> {
  await apiFetch(
    `/records/${encodeURIComponent(recordId)}/attachments/${encodeURIComponent(attachmentId)}`,
    z.unknown(),
    { method: "DELETE" },
  );
}
