import { z } from "zod";
import { jsonBody, requestJson } from "@/api/client/request-json";

export async function resetPassword(
  token: string,
  password: string,
): Promise<void> {
  await requestJson(
    "/users/password/reset",
    z.unknown(),
    jsonBody({ token, password }),
  );
}
