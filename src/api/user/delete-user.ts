import { z } from "zod";
import { apiFetch } from "@/api/client/api-fetch";

export async function deleteUser(): Promise<void> {
  await apiFetch("/users/", z.unknown(), { method: "DELETE" });
}
