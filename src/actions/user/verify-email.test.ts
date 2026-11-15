import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const verifyEmail = vi.fn();

vi.mock("@/api/user/verify-email", () => ({ verifyEmail }));

const { verifyEmailAction } = await import("@/actions/user/verify-email");

beforeEach(() => {
  vi.clearAllMocks();
  verifyEmail.mockResolvedValue(undefined);
});

describe("verifyEmailAction", () => {
  it("sends the token and succeeds", async () => {
    await expect(
      verifyEmailAction("token-value", undefined, new FormData()),
    ).resolves.toEqual({ success: true, data: null });
    expect(verifyEmail).toHaveBeenCalledWith("token-value");
  });

  const cases = [
    [new ApiError(400, "INVALID_VERIFICATION_TOKEN"), "invalidToken"],
    [new ApiError(400, "INVALID_INPUT"), "invalidToken"],
    [new ApiError(429, "TOO_MANY_REQUESTS"), "tooManyRequests"],
    [new ApiError(500, "INTERNAL_SERVER_ERROR"), "unexpectedError"],
  ] as const;
  for (const [error, messageKey] of cases) {
    it(`returns ${messageKey} for ${error.code}`, async () => {
      verifyEmail.mockRejectedValue(error);
      await expect(
        verifyEmailAction("token-value", undefined, new FormData()),
      ).resolves.toEqual({ success: false, messageKey });
    });
  }

  it("rethrows errors that are not API errors", async () => {
    verifyEmail.mockRejectedValue(new Error("network"));
    await expect(
      verifyEmailAction("token-value", undefined, new FormData()),
    ).rejects.toThrow("network");
  });
});
