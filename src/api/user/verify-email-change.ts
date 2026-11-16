import { z } from "zod";
import { jsonBody, requestJson } from "@/api/client/request-json";

export async function verifyEmailChange(token: string): Promise<void> {
  await requestJson("/users/email/verify", z.unknown(), jsonBody({ token }));
}
