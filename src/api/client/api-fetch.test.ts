import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ApiError } from "@/api/client/api-error";

const headerValues = new Map<string, string>();
const cookieValues = new Map<string, string>();
const requestJson = vi.fn();

vi.mock("next/headers", () => ({
  headers: async () => ({
    get: (name: string) => headerValues.get(name) ?? null,
  }),
  cookies: async () => ({
    get: (name: string) =>
      cookieValues.has(name) ? { value: cookieValues.get(name) } : undefined,
  }),
}));
vi.mock("next/navigation", () => import("@/test/next-navigation"));
vi.mock("@/api/client/request-json", () => ({ requestJson }));

const { apiFetch } = await import("@/api/client/api-fetch");
const schema = z.unknown();

beforeEach(() => {
  headerValues.clear();
  cookieValues.clear();
  requestJson.mockReset();
});

describe("apiFetch", () => {
  it("sends the access token as a bearer token", async () => {
    cookieValues.set("access_token", "token");
    requestJson.mockResolvedValue("ok");
    await expect(
      apiFetch("/users/", schema, { method: "PUT", headers: { A: "1" } }),
    ).resolves.toBe("ok");
    const [path, , init] = requestJson.mock.calls[0] ?? [];
    expect(path).toBe("/users/");
    expect(init.method).toBe("PUT");
    expect(init.headers.get("Authorization")).toBe("Bearer token");
    expect(init.headers.get("A")).toBe("1");
  });

  it("sends no Authorization header without an access token", async () => {
    requestJson.mockResolvedValue("ok");
    await apiFetch("/users/", schema);
    expect(requestJson.mock.calls[0]?.[2].headers.has("Authorization")).toBe(
      false,
    );
  });

  for (const code of ["INVALID_ACCESS_TOKEN", "UNAUTHENTICATED"] as const) {
    it(`redirects to the login page of the locale on ${code}`, async () => {
      headerValues.set("x-locale", "en");
      requestJson.mockRejectedValue(new ApiError(401, code));
      await expect(apiFetch("/users/", schema)).rejects.toThrow(
        "REDIRECT /en/login",
      );
    });
  }

  it("redirects to /login when the locale is unknown", async () => {
    requestJson.mockRejectedValue(new ApiError(401, "UNAUTHENTICATED"));
    await expect(apiFetch("/users/", schema)).rejects.toThrow(
      "REDIRECT /login",
    );
  });

  it("rethrows other errors", async () => {
    const error = new ApiError(404, "RECORD_NOT_FOUND");
    requestJson.mockRejectedValue(error);
    await expect(apiFetch("/records/1", schema)).rejects.toBe(error);
  });
});
