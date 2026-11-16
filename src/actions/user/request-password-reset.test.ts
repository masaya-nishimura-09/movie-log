import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const requestPasswordReset = vi.fn();

vi.mock("@/api/user/request-password-reset", () => ({
  requestPasswordReset,
}));

const { requestPasswordResetAction, resendPasswordResetAction } = await import(
  "@/actions/user/request-password-reset"
);

function form(email: string) {
  const data = new FormData();
  data.set("email", email);
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  requestPasswordReset.mockResolvedValue(undefined);
});

describe("requestPasswordResetAction", () => {
  it("sends the email with the language and returns it", async () => {
    await expect(
      requestPasswordResetAction("en", undefined, form("user@example.com")),
    ).resolves.toEqual({ success: true, data: { email: "user@example.com" } });
    expect(requestPasswordReset).toHaveBeenCalledWith("user@example.com", "en");
  });

  it("returns a field error for an invalid email without calling the API", async () => {
    const result = await requestPasswordResetAction(
      "ja",
      undefined,
      form("user"),
    );
    expect(result).toMatchObject({
      success: false,
      messageKey: "invalidInput",
      errors: { email: expect.any(Array) },
    });
    expect(requestPasswordReset).not.toHaveBeenCalled();
  });

  const cases = [
    [new ApiError(429, "TOO_MANY_REQUESTS"), "tooManyRequests"],
    [new ApiError(400, "INVALID_INPUT"), "unexpectedError"],
    [new ApiError(500, "INTERNAL_SERVER_ERROR"), "unexpectedError"],
  ] as const;
  for (const [error, messageKey] of cases) {
    it(`returns ${messageKey} for ${error.code}`, async () => {
      requestPasswordReset.mockRejectedValue(error);
      await expect(
        requestPasswordResetAction("ja", undefined, form("user@example.com")),
      ).resolves.toEqual({ success: false, messageKey });
    });
  }

  it("rethrows errors that are not API errors", async () => {
    requestPasswordReset.mockRejectedValue(new Error("network"));
    await expect(
      requestPasswordResetAction("ja", undefined, form("user@example.com")),
    ).rejects.toThrow("network");
  });
});

describe("resendPasswordResetAction", () => {
  it("sends the email again with the language", async () => {
    await expect(
      resendPasswordResetAction("ja", "user@example.com"),
    ).resolves.toEqual({ success: true, data: null });
    expect(requestPasswordReset).toHaveBeenCalledWith("user@example.com", "ja");
  });

  it("fails without calling the API for an invalid email or language", async () => {
    for (const [lang, email] of [
      ["ja", "user"],
      ["ja&x=1", "user@example.com"],
    ] as const) {
      await expect(
        resendPasswordResetAction(lang as "ja", email),
      ).resolves.toEqual({ success: false, messageKey: "resendFailed" });
    }
    expect(requestPasswordReset).not.toHaveBeenCalled();
  });

  const cases = [
    [new ApiError(429, "TOO_MANY_REQUESTS"), "tooManyRequests"],
    [new ApiError(500, "INTERNAL_SERVER_ERROR"), "resendFailed"],
  ] as const;
  for (const [error, messageKey] of cases) {
    it(`returns ${messageKey} for ${error.code}`, async () => {
      requestPasswordReset.mockRejectedValue(error);
      await expect(
        resendPasswordResetAction("ja", "user@example.com"),
      ).resolves.toEqual({ success: false, messageKey });
    });
  }
});
