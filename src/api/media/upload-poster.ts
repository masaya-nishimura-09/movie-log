import { apiFetch } from "@/api/client/api-fetch";
import { mediaUploadResponseSchema } from "@/schemas/media/media";

export async function uploadPoster(file: File): Promise<string> {
  const body = new FormData();
  body.set("file", file);
  return apiFetch("/media/", mediaUploadResponseSchema, {
    method: "POST",
    body,
  });
}
