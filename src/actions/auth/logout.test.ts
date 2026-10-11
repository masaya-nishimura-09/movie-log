import { beforeEach, describe, expect, it, vi } from "vitest";

const cookieValues = new Map<string, string>();
const logout = vi.fn();
const endSession = vi.fn();

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      cookieValues.has(name) ? { value: cookieValues.get(name) } : undefined,
  }),
}));
vi.mock("next/navigation", () => import("@/test/next-navigation"));
vi.mock("@/api/auth/logout", () => ({ logout }));
vi.mock("@/lib/auth/session", () => ({ endSession }));

const { logoutAction } = await import("@/actions/auth/logout");

beforeEach(() => {
  vi.clearAllMocks();
  cookieValues.clear();
});

describe("logoutAction", () => {
  it("revokes the refresh token, ends the session and moves to login", async () => {
    cookieValues.set("refresh_token", "refresh");
    logout.mockResolvedValue(undefined);
    await expect(logoutAction("en")).rejects.toThrow("REDIRECT /en/login");
    expect(logout).toHaveBeenCalledWith("refresh");
    expect(endSession).toHaveBeenCalled();
  });

  it("ends the session even when revoking fails", async () => {
    cookieValues.set("refresh_token", "refresh");
    logout.mockRejectedValue(new Error("failed"));
    await expect(logoutAction("ja")).rejects.toThrow("REDIRECT /ja/login");
    expect(endSession).toHaveBeenCalled();
  });

  it("skips revoking without a refresh token", async () => {
    await expect(logoutAction("ja")).rejects.toThrow("REDIRECT /ja/login");
    expect(logout).not.toHaveBeenCalled();
    expect(endSession).toHaveBeenCalled();
  });
});
