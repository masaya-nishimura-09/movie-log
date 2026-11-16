import { beforeEach, describe, expect, it, vi } from "vitest";

const requestJson = vi.fn();

vi.mock("@/api/client/request-json", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/api/client/request-json")>()),
  requestJson,
}));

beforeEach(() => {
  requestJson.mockReset();
});

const { resetPassword } = await import("@/api/user/reset-password");

describe("resetPassword", () => {
  it("posts the token and the new password to /users/password/reset without the access token", async () => {
    requestJson.mockResolvedValue(undefined);
    await resetPassword("token-value", "new-password");
    const [path, , init] = requestJson.mock.calls[0] ?? [];
    expect(path).toBe("/users/password/reset");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      token: "token-value",
      password: "new-password",
    });
  });
});
