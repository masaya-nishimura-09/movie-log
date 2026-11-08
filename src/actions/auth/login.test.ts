import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const startSession = vi.fn();
const verifyTurnstile = vi.fn();

vi.mock("next/navigation", () => import("@/test/next-navigation"));
vi.mock("@/lib/auth/session", () => ({ startSession }));
vi.mock("@/lib/turnstile/verify-turnstile", () => ({ verifyTurnstile }));

const { loginAction } = await import("@/actions/auth/login");

function form(email: string, password: string) {
  const data = new FormData();
  data.set("email", email);
  data.set("password", password);
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  verifyTurnstile.mockResolvedValue(undefined);
});

describe("loginAction", () => {
  it("logs in and moves to the records", async () => {
    startSession.mockResolvedValue(undefined);
    await expect(
      loginAction("en", undefined, form("user@example.com", "password")),
    ).rejects.toThrow("REDIRECT /en/records");
    expect(startSession).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password",
    });
  });

  it("returns field errors for invalid input without calling the API", async () => {
    await expect(
      loginAction("ja", undefined, form("user", "short")),
    ).resolves.toEqual({
      success: false,
      messageKey: "invalidInput",
      errors: { email: ["invalidEmail"], password: ["invalidPassword"] },
    });
    expect(verifyTurnstile).not.toHaveBeenCalled();
    expect(startSession).not.toHaveBeenCalled();
  });

  it("returns the Turnstile failure without calling the API", async () => {
    verifyTurnstile.mockResolvedValue("verificationFailed");
    await expect(
      loginAction("ja", undefined, form("user@example.com", "password")),
    ).resolves.toEqual({ success: false, messageKey: "verificationFailed" });
    expect(startSession).not.toHaveBeenCalled();
  });

  const cases = [
    [new ApiError(401, "INVALID_CREDENTIALS"), "invalidCredentials"],
    [new ApiError(429, "TOO_MANY_REQUESTS"), "tooManyRequests"],
    [new ApiError(500, "INTERNAL_SERVER_ERROR"), "unexpectedError"],
    [new Error("network"), "unexpectedError"],
  ] as const;
  for (const [error, messageKey] of cases) {
    it(`returns ${messageKey} for ${error.message}`, async () => {
      startSession.mockRejectedValue(error);
      await expect(
        loginAction("ja", undefined, form("user@example.com", "password")),
      ).resolves.toEqual({ success: false, messageKey });
    });
  }
});
