import { z } from "zod";
import { jsonBody, requestJson } from "@/api/client/request-json";

export async function logout(refreshToken: string): Promise<void> {
  await requestJson(
    "/auth/logout",
    z.unknown(),
    jsonBody({ refresh_token: refreshToken }),
  );
}
