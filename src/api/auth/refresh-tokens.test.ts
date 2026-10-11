import { beforeEach, describe, expect, it, vi } from "vitest";

const requestJson = vi.fn();

vi.mock("@/api/client/request-json", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/api/client/request-json")>()),
  requestJson,
}));

beforeEach(() => {
  requestJson.mockReset();
});

const { refreshTokens } = await import("@/api/auth/refresh-tokens");

describe("refreshTokens", () => {
  it("posts the refresh token to /auth/refresh and returns new tokens", async () => {
    requestJson.mockResolvedValue({ accessToken: "a", refreshToken: "r" });
    await expect(refreshTokens("refresh")).resolves.toEqual({
      accessToken: "a",
      refreshToken: "r",
    });
    const [path, , init] = requestJson.mock.calls[0] ?? [];
    expect(path).toBe("/auth/refresh");
    expect(JSON.parse(init.body)).toEqual({ refresh_token: "refresh" });
  });
});
