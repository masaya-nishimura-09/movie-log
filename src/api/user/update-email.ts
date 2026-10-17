import { z } from "zod";
import { apiFetch } from "@/api/client/api-fetch";
import { jsonBody } from "@/api/client/request-json";
import type { EmailChangeInput } from "@/schemas/user/user-input";

export async function updateEmail(input: EmailChangeInput): Promise<void> {
  await apiFetch("/users/email", z.unknown(), jsonBody(input, "PUT"));
}
