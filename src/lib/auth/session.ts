import { cookies } from "next/headers";
import { login } from "@/api/auth/login";
import {
  accessTokenCookie,
  refreshTokenCookie,
  tokenCookies,
} from "@/lib/auth/token-cookies";
import type { LoginInput } from "@/schemas/auth/login";

export async function startSession(input: LoginInput): Promise<void> {
  const tokens = await login(input);
  const store = await cookies();
  for (const cookie of tokenCookies(tokens)) store.set(cookie);
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(accessTokenCookie);
  store.delete(refreshTokenCookie);
}
