import { jsonBody, requestJson } from "@/api/client/request-json";
import { type TokenPair, tokenPairResponseSchema } from "@/schemas/auth/token";

export async function refreshTokens(refreshToken: string): Promise<TokenPair> {
  return requestJson(
    "/auth/refresh",
    tokenPairResponseSchema,
    jsonBody({ refresh_token: refreshToken }),
  );
}
