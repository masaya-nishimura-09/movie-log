import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const refreshTokens = vi.fn();

vi.mock("@/api/auth/refresh-tokens", () => ({ refreshTokens }));

const { config, proxy } = await import("@/proxy");

function jwt(exp: number) {
  const encode = (value: object) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({})}.${encode({ exp })}.x`;
}

const valid = jwt(Math.floor(Date.now() / 1000) + 3600);
const expired = jwt(1);

function request(
  path: string,
  {
    cookies = {},
    language,
  }: { cookies?: Record<string, string>; language?: string } = {},
) {
  const headers = new Headers();
  if (language) headers.set("accept-language", language);
  const cookie = Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
  if (cookie) headers.set("cookie", cookie);
  return new NextRequest(`http://localhost${path}`, { headers });
}

function location(response: Response) {
  const value = response.headers.get("location");
  return value ? new URL(value).pathname + new URL(value).search : null;
}

beforeEach(() => {
  refreshTokens.mockReset();
});

describe("proxy: 言語", () => {
  it("adds the negotiated locale to a URL without one", async () => {
    expect(location(await proxy(request("/", { language: "ja" })))).toBe("/ja");
    expect(
      location(await proxy(request("/records?q=a", { language: "en-US" }))),
    ).toBe("/en/records?q=a");
    expect(location(await proxy(request("/about")))).toBe("/en/about");
  });

  it("does not treat a path that only starts with the locale as localized", async () => {
    expect(location(await proxy(request("/japan", { language: "ja" })))).toBe(
      "/ja/japan",
    );
  });

  it("passes the locale to the page in a header", async () => {
    const response = await proxy(request("/en/login"));
    expect(response.headers.get("x-middleware-request-x-locale")).toBe("en");
  });
});

describe("proxy: ログイン", () => {
  it("lets anyone open the public pages", async () => {
    for (const path of [
      "/ja",
      "/ja/login",
      "/ja/register",
      "/ja/about",
      "/ja/terms",
      "/ja/privacy",
      "/ja/contact",
    ]) {
      const response = await proxy(request(path));
      expect(location(response)).toBeNull();
    }
  });

  it("moves to login without tokens, dropping the query", async () => {
    expect(location(await proxy(request("/ja/records?q=a")))).toBe("/ja/login");
  });

  it("lets a user with a valid access token in", async () => {
    const response = await proxy(
      request("/ja/records", { cookies: { access_token: valid } }),
    );
    expect(location(response)).toBeNull();
    expect(refreshTokens).not.toHaveBeenCalled();
  });

  it("refreshes an expired access token and sets the new cookies", async () => {
    refreshTokens.mockResolvedValue({
      accessToken: valid,
      refreshToken: "new-refresh",
    });
    const response = await proxy(
      request("/ja/records", {
        cookies: { access_token: expired, refresh_token: "refresh" },
      }),
    );
    expect(refreshTokens).toHaveBeenCalledWith("refresh");
    expect(location(response)).toBeNull();
    expect(response.cookies.get("access_token")?.value).toBe(valid);
    expect(response.cookies.get("refresh_token")).toMatchObject({
      value: "new-refresh",
      httpOnly: true,
    });
    expect(response.headers.get("x-middleware-request-cookie")).toContain(
      "refresh_token=new-refresh",
    );
  });

  it("refreshes when only the refresh token is left", async () => {
    refreshTokens.mockResolvedValue({ accessToken: valid, refreshToken: "r" });
    const response = await proxy(
      request("/ja/account", { cookies: { refresh_token: "refresh" } }),
    );
    expect(location(response)).toBeNull();
  });

  it("moves to login when the refresh token is rejected", async () => {
    refreshTokens.mockRejectedValue(new ApiError(401, "INVALID_REFRESH_TOKEN"));
    const response = await proxy(
      request("/en/records", { cookies: { refresh_token: "invalid" } }),
    );
    expect(location(response)).toBe("/en/login");
  });

  it("rethrows errors that are not API errors", async () => {
    refreshTokens.mockRejectedValue(new Error("network"));
    await expect(
      proxy(request("/ja/records", { cookies: { refresh_token: "refresh" } })),
    ).rejects.toThrow("network");
  });
});

describe("proxy: 対象の URL", () => {
  it("runs on pages", () => {
    for (const url of ["/", "/ja", "/ja/records", "/en/records/1/edit"]) {
      expect(unstable_doesMiddlewareMatch({ config, url })).toBe(true);
    }
  });

  it("skips API routes, static assets and files", () => {
    for (const url of [
      "/api/health",
      "/_next/static/chunks/main.js",
      "/_next/image?url=a",
      "/favicon.ico",
      "/icon.svg",
    ]) {
      expect(unstable_doesMiddlewareMatch({ config, url })).toBe(false);
    }
  });
});
