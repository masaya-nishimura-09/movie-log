import { beforeEach, describe, expect, it, vi } from "vitest";

const requestJson = vi.fn();

vi.mock("@/api/client/request-json", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/api/client/request-json")>()),
  requestJson,
}));

beforeEach(() => {
  requestJson.mockReset();
});

const { login } = await import("@/api/auth/login");

describe("login", () => {
  it("posts the email and password to /auth/login", async () => {
    requestJson.mockResolvedValue({ accessToken: "a", refreshToken: "r" });
    await expect(
      login({ email: "user@example.com", password: "password" }),
    ).resolves.toEqual({ accessToken: "a", refreshToken: "r" });
    const [path, , init] = requestJson.mock.calls[0] ?? [];
    expect(path).toBe("/auth/login");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      email: "user@example.com",
      password: "password",
    });
  });
});
