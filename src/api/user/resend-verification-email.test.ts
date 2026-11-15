import { beforeEach, describe, expect, it, vi } from "vitest";

const requestJson = vi.fn();

vi.mock("@/api/client/request-json", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/api/client/request-json")>()),
  requestJson,
}));

beforeEach(() => {
  requestJson.mockReset();
});

const { resendVerificationEmail } = await import(
  "@/api/user/resend-verification-email"
);

describe("resendVerificationEmail", () => {
  it("posts the email to /users/verify-email/resend with the language, without the access token", async () => {
    requestJson.mockResolvedValue(undefined);
    await resendVerificationEmail("user@example.com", "en");
    const [path, , init] = requestJson.mock.calls[0] ?? [];
    expect(path).toBe("/users/verify-email/resend?language=en");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ email: "user@example.com" });
  });
});
