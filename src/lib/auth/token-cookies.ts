import type { TokenPair } from "@/schemas/auth/token";

export const accessTokenCookie = "access_token";
export const refreshTokenCookie = "refresh_token";

const refreshTokenMaxAge = 30 * 24 * 60 * 60;

const baseOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
} as const;

function readJwtPayload(token: string): Record<string, unknown> | undefined {
  const payload = token.split(".")[1];
  if (!payload) return undefined;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString());
  } catch {
    return undefined;
  }
}

export function readJwtExpiry(token: string): Date | undefined {
  const exp = readJwtPayload(token)?.exp;
  return typeof exp === "number" ? new Date(exp * 1000) : undefined;
}

export function readJwtUserId(token: string): string | undefined {
  const payload = readJwtPayload(token);
  const id = payload?.UserID ?? payload?.sub;
  return typeof id === "number" || typeof id === "string"
    ? String(id)
    : undefined;
}

export function isTokenExpired(token: string, now = new Date()): boolean {
  const expiry = readJwtExpiry(token);
  return !expiry || expiry.getTime() - 30_000 <= now.getTime();
}

export function tokenCookies(tokens: TokenPair) {
  return [
    {
      name: accessTokenCookie,
      value: tokens.accessToken,
      expires: readJwtExpiry(tokens.accessToken),
      ...baseOptions,
    },
    {
      name: refreshTokenCookie,
      value: tokens.refreshToken,
      maxAge: refreshTokenMaxAge,
      ...baseOptions,
    },
  ];
}
