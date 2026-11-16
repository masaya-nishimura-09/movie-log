import { beforeEach, describe, expect, it, vi } from "vitest";

const requestJson = vi.fn();

vi.mock("@/api/client/request-json", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/api/client/request-json")>()),
  requestJson,
}));

beforeEach(() => {
  requestJson.mockReset();
});

const { verifyEmailChange } = await import("@/api/user/verify-email-change");

describe("verifyEmailChange", () => {
  it("posts the token to /users/email/verify without the access token", async () => {
    requestJson.mockResolvedValue(undefined);
    await verifyEmailChange("token-value");
    const [path, , init] = requestJson.mock.calls[0] ?? [];
    expect(path).toBe("/users/email/verify");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ token: "token-value" });
  });
});
