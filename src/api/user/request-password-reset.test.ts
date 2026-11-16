import { beforeEach, describe, expect, it, vi } from "vitest";

const requestJson = vi.fn();

vi.mock("@/api/client/request-json", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/api/client/request-json")>()),
  requestJson,
}));

beforeEach(() => {
  requestJson.mockReset();
});

const { requestPasswordReset } = await import(
  "@/api/user/request-password-reset"
);

describe("requestPasswordReset", () => {
  it("posts the email to /users/password/reset-request with the language, without the access token", async () => {
    requestJson.mockResolvedValue(undefined);
    await requestPasswordReset("user@example.com", "ja");
    const [path, , init] = requestJson.mock.calls[0] ?? [];
    expect(path).toBe("/users/password/reset-request?language=ja");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ email: "user@example.com" });
  });
});
