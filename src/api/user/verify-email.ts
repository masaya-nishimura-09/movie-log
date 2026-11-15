import { z } from "zod";
import { jsonBody, requestJson } from "@/api/client/request-json";

export async function verifyEmail(token: string): Promise<void> {
  await requestJson("/users/verify-email", z.unknown(), jsonBody({ token }));
}
