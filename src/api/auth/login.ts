import { jsonBody, requestJson } from "@/api/client/request-json";
import type { LoginInput } from "@/schemas/auth/login";
import { type TokenPair, tokenPairResponseSchema } from "@/schemas/auth/token";

export async function login(input: LoginInput): Promise<TokenPair> {
  return requestJson("/auth/login", tokenPairResponseSchema, jsonBody(input));
}
