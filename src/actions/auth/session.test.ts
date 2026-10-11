import { beforeEach, describe, expect, it, vi } from "vitest";

const store = { set: vi.fn(), delete: vi.fn() };
const login = vi.fn();

vi.mock("next/headers", () => ({ cookies: async () => store }));
vi.mock("@/api/auth/login", () => ({ login }));

const { endSession, startSession } = await import("@/actions/auth/session");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("startSession", () => {
  it("logs in and stores both tokens as cookies", async () => {
    const encode = (value: object) =>
      Buffer.from(JSON.stringify(value)).toString("base64url");
    const accessToken = `${encode({})}.${encode({ exp: 1_800_000_000 })}.x`;
    login.mockResolvedValue({ accessToken, refreshToken: "refresh" });
    await startSession({ email: "user@example.com", password: "password" });
    expect(login).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password",
    });
    expect(store.set.mock.calls.map(([cookie]) => cookie.name)).toEqual([
      "access_token",
      "refresh_token",
    ]);
    expect(store.set.mock.calls[0]?.[0].value).toBe(accessToken);
  });

  it("stores nothing when login fails", async () => {
    login.mockRejectedValue(new Error("failed"));
    await expect(
      startSession({ email: "user@example.com", password: "password" }),
    ).rejects.toThrow("failed");
    expect(store.set).not.toHaveBeenCalled();
  });
});

describe("endSession", () => {
  it("deletes both token cookies", async () => {
    await endSession();
    expect(store.delete.mock.calls).toEqual([
      ["access_token"],
      ["refresh_token"],
    ]);
  });
});
