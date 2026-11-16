import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const resetPassword = vi.fn();
const endSession = vi.fn();

vi.mock("@/api/user/reset-password", () => ({ resetPassword }));
vi.mock("@/lib/auth/session", () => ({ endSession }));

const { resetPasswordAction } = await import("@/actions/user/reset-password");

function form(password: string) {
  const data = new FormData();
  data.set("password", password);
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  resetPassword.mockResolvedValue(undefined);
});

describe("resetPasswordAction", () => {
  it("sends the token and the new password, then ends the session in this browser", async () => {
    await expect(
      resetPasswordAction("token-value", undefined, form("new-password")),
    ).resolves.toEqual({ success: true, data: null });
    expect(resetPassword).toHaveBeenCalledWith("token-value", "new-password");
    expect(endSession).toHaveBeenCalled();
  });

  it("returns a field error for an invalid password without calling the API", async () => {
    const result = await resetPasswordAction(
      "token-value",
      undefined,
      form("short"),
    );
    expect(result).toMatchObject({
      success: false,
      messageKey: "invalidInput",
      errors: { password: expect.any(Array) },
    });
    expect(resetPassword).not.toHaveBeenCalled();
  });

  const cases = [
    [new ApiError(400, "INVALID_PASSWORD_RESET_TOKEN"), "invalidToken"],
    [new ApiError(400, "INVALID_INPUT"), "invalidToken"],
    [new ApiError(429, "TOO_MANY_REQUESTS"), "tooManyRequests"],
    [new ApiError(500, "INTERNAL_SERVER_ERROR"), "unexpectedError"],
  ] as const;
  for (const [error, messageKey] of cases) {
    it(`returns ${messageKey} for ${error.code}`, async () => {
      resetPassword.mockRejectedValue(error);
      await expect(
        resetPasswordAction("token-value", undefined, form("new-password")),
      ).resolves.toEqual({ success: false, messageKey });
      expect(endSession).not.toHaveBeenCalled();
    });
  }

  it("rethrows errors that are not API errors", async () => {
    resetPassword.mockRejectedValue(new Error("network"));
    await expect(
      resetPasswordAction("token-value", undefined, form("new-password")),
    ).rejects.toThrow("network");
  });
});
