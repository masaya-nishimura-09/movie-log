import { beforeEach, describe, expect, it, vi } from "vitest";

const requestJson = vi.fn();

vi.mock("@/api/client/request-json", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/api/client/request-json")>()),
  requestJson,
}));

beforeEach(() => {
  requestJson.mockReset();
});

const { logout } = await import("@/api/auth/logout");

describe("logout", () => {
  it("posts the refresh token to /auth/logout", async () => {
    requestJson.mockResolvedValue(undefined);
    await logout("refresh");
    const [path, , init] = requestJson.mock.calls[0] ?? [];
    expect(path).toBe("/auth/logout");
    expect(JSON.parse(init.body)).toEqual({ refresh_token: "refresh" });
  });
});
