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

export function readJwtExpiry(token: string): Date | undefined {
  const payload = token.split(".")[1];
  if (!payload) return undefined;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" ? new Date(exp * 1000) : undefined;
  } catch {
    return undefined;
  }
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
