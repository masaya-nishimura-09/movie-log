import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const resendVerificationEmail = vi.fn();

vi.mock("@/api/user/resend-verification-email", () => ({
  resendVerificationEmail,
}));

const { resendVerificationEmailAction } = await import(
  "@/actions/user/resend-verification-email"
);

beforeEach(() => {
  vi.clearAllMocks();
  resendVerificationEmail.mockResolvedValue(undefined);
});

describe("resendVerificationEmailAction", () => {
  it("sends the email with the language and succeeds", async () => {
    await expect(
      resendVerificationEmailAction("ja", "user@example.com"),
    ).resolves.toEqual({ success: true, data: null });
    expect(resendVerificationEmail).toHaveBeenCalledWith(
      "user@example.com",
      "ja",
    );
  });

  it("fails without calling the API for an invalid email", async () => {
    await expect(
      resendVerificationEmailAction("ja", "not-an-email"),
    ).resolves.toEqual({ success: false, messageKey: "resendFailed" });
    expect(resendVerificationEmail).not.toHaveBeenCalled();
  });

  it("fails without calling the API for an unsupported language", async () => {
    await expect(
      resendVerificationEmailAction("ja&x=1" as "ja", "user@example.com"),
    ).resolves.toEqual({ success: false, messageKey: "resendFailed" });
    expect(resendVerificationEmail).not.toHaveBeenCalled();
  });

  const cases = [
    [new ApiError(429, "TOO_MANY_REQUESTS"), "tooManyRequests"],
    [new ApiError(400, "INVALID_INPUT"), "resendFailed"],
    [new ApiError(500, "INTERNAL_SERVER_ERROR"), "resendFailed"],
  ] as const;
  for (const [error, messageKey] of cases) {
    it(`returns ${messageKey} for ${error.code}`, async () => {
      resendVerificationEmail.mockRejectedValue(error);
      await expect(
        resendVerificationEmailAction("ja", "user@example.com"),
      ).resolves.toEqual({ success: false, messageKey });
    });
  }

  it("rethrows errors that are not API errors", async () => {
    resendVerificationEmail.mockRejectedValue(new Error("network"));
    await expect(
      resendVerificationEmailAction("ja", "user@example.com"),
    ).rejects.toThrow("network");
  });
});
