import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const updatePassword = vi.fn();
const getCurrentUser = vi.fn();
const startSession = vi.fn();
const endSession = vi.fn();

vi.mock("next/navigation", () => import("@/test/next-navigation"));
vi.mock("@/api/user/update-password", () => ({ updatePassword }));
vi.mock("@/api/user/get-current-user", () => ({ getCurrentUser }));
vi.mock("@/lib/auth/session", () => ({ startSession, endSession }));

const { updatePasswordAction } = await import("@/actions/user/update-password");

function form(fields: Record<string, string> = {}) {
  const data = new FormData();
  const values = {
    oldPassword: "old-password",
    newPassword: "new-password",
    ...fields,
  };
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  updatePassword.mockResolvedValue(undefined);
  getCurrentUser.mockResolvedValue({
    username: "tester",
    email: "user@example.com",
  });
  startSession.mockResolvedValue(undefined);
});

describe("updatePasswordAction", () => {
  it("updates the password and logs in again with the new password", async () => {
    await expect(
      updatePasswordAction("ja", undefined, form()),
    ).resolves.toEqual({ success: true, data: null });
    expect(updatePassword).toHaveBeenCalledWith({
      oldPassword: "old-password",
      newPassword: "new-password",
    });
    expect(startSession).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "new-password",
    });
  });

  it("ends the session and moves to login when logging in again fails", async () => {
    startSession.mockRejectedValue(new Error("failed"));
    await expect(updatePasswordAction("en", undefined, form())).rejects.toThrow(
      "REDIRECT /en/login",
    );
    expect(endSession).toHaveBeenCalled();
  });

  it("returns field errors for invalid input", async () => {
    const result = await updatePasswordAction(
      "ja",
      undefined,
      form({ oldPassword: "short", newPassword: "short" }),
    );
    expect(result).toMatchObject({
      success: false,
      messageKey: "invalidInput",
    });
    expect(updatePassword).not.toHaveBeenCalled();
  });

  const cases = [
    [new ApiError(400, "INVALID_CURRENT_PASSWORD"), "invalidCurrentPassword"],
    [new ApiError(429, "TOO_MANY_REQUESTS"), "tooManyRequests"],
    [new ApiError(500, "INTERNAL_SERVER_ERROR"), "unexpectedError"],
  ] as const;
  for (const [error, messageKey] of cases) {
    it(`returns ${messageKey} for ${error.code}`, async () => {
      updatePassword.mockRejectedValue(error);
      await expect(
        updatePasswordAction("ja", undefined, form()),
      ).resolves.toEqual({ success: false, messageKey });
      expect(startSession).not.toHaveBeenCalled();
    });
  }

  it("rethrows errors that are not API errors", async () => {
    updatePassword.mockRejectedValue(new Error("network"));
    await expect(updatePasswordAction("ja", undefined, form())).rejects.toThrow(
      "network",
    );
  });
});
