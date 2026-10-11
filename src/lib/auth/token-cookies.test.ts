import { describe, expect, it } from "vitest";
import {
  accessTokenCookie,
  isTokenExpired,
  readJwtExpiry,
  readJwtUserId,
  refreshTokenCookie,
  tokenCookies,
} from "@/lib/auth/token-cookies";

function jwt(payload: Record<string, unknown>): string {
  const encode = (value: unknown) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "HS256" })}.${encode(payload)}.signature`;
}

describe("readJwtUserId", () => {
  it("reads a numeric UserID", () => {
    expect(readJwtUserId(jwt({ UserID: 42 }))).toBe("42");
  });

  it("falls back to sub", () => {
    expect(readJwtUserId(jwt({ sub: "user-1" }))).toBe("user-1");
  });

  it("prefers UserID over sub", () => {
    expect(readJwtUserId(jwt({ UserID: 42, sub: "user-1" }))).toBe("42");
  });

  it("returns undefined when there is no user ID", () => {
    expect(readJwtUserId(jwt({ exp: 1 }))).toBeUndefined();
  });

  it("returns undefined for a token that is not a JWT", () => {
    expect(readJwtUserId("not-a-jwt")).toBeUndefined();
    expect(readJwtUserId("a.%%%.c")).toBeUndefined();
  });
});

describe("readJwtExpiry", () => {
  it("converts exp from seconds to a date", () => {
    expect(readJwtExpiry(jwt({ exp: 1_800_000_000 }))).toEqual(
      new Date(1_800_000_000_000),
    );
  });

  it("returns undefined when exp is missing", () => {
    expect(readJwtExpiry(jwt({}))).toBeUndefined();
  });
});

describe("isTokenExpired", () => {
  const now = new Date("2026-10-11T00:00:00Z");
  const expiresIn = (seconds: number) =>
    jwt({ exp: now.getTime() / 1000 + seconds });

  it("treats a token with more than 30 seconds left as valid", () => {
    expect(isTokenExpired(expiresIn(31), now)).toBe(false);
  });

  it("treats a token with 30 seconds or less left as expired", () => {
    expect(isTokenExpired(expiresIn(30), now)).toBe(true);
  });

  it("treats a token without exp as expired", () => {
    expect(isTokenExpired(jwt({}), now)).toBe(true);
  });
});

describe("tokenCookies", () => {
  it("returns HTTP-only cookies for both tokens", () => {
    const accessToken = jwt({ exp: 1_800_000_000 });
    const cookies = tokenCookies({ accessToken, refreshToken: "refresh" });
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    };
    expect(cookies).toEqual([
      {
        name: accessTokenCookie,
        value: accessToken,
        expires: new Date(1_800_000_000_000),
        ...options,
      },
      {
        name: refreshTokenCookie,
        value: "refresh",
        maxAge: 30 * 24 * 60 * 60,
        ...options,
      },
    ]);
  });
});
