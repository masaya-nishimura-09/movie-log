import { z } from "zod";
import { apiFetch } from "@/api/client/api-fetch";

export async function deleteRecord(recordId: string): Promise<void> {
  await apiFetch(`/records/${encodeURIComponent(recordId)}`, z.unknown(), {
    method: "DELETE",
  });
}
