import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const registerUser = vi.fn();
const verifyTurnstile = vi.fn();

vi.mock("@/api/user/register-user", () => ({ registerUser }));
vi.mock("@/lib/turnstile/verify-turnstile", () => ({ verifyTurnstile }));

const { registerAction } = await import("@/actions/user/register");

function form(fields: Record<string, string> = {}) {
  const data = new FormData();
  const values = {
    username: "tester",
    email: "user@example.com",
    password: "password",
    agreedToTerms: "on",
    ...fields,
  };
  for (const [key, value] of Object.entries(values)) {
    if (value !== "") data.set(key, value);
  }
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  verifyTurnstile.mockResolvedValue(undefined);
  registerUser.mockResolvedValue(undefined);
});

describe("registerAction", () => {
  it("registers with the language and returns the email without logging in", async () => {
    await expect(registerAction("en", undefined, form())).resolves.toEqual({
      success: true,
      data: { email: "user@example.com" },
    });
    expect(registerUser).toHaveBeenCalledWith(
      {
        username: "tester",
        email: "user@example.com",
        password: "password",
      },
      "en",
    );
  });

  it("returns field errors for invalid input", async () => {
    const result = await registerAction(
      "ja",
      undefined,
      form({ username: "", email: "user", password: "short" }),
    );
    expect(result).toMatchObject({
      success: false,
      messageKey: "invalidInput",
    });
    expect(
      Object.keys(result.success ? {} : (result.errors ?? {})).sort(),
    ).toEqual(["email", "password", "username"]);
    expect(registerUser).not.toHaveBeenCalled();
  });

  it("requires agreeing to the terms", async () => {
    await expect(
      registerAction("ja", undefined, form({ agreedToTerms: "" })),
    ).resolves.toEqual({ success: false, messageKey: "termsNotAgreed" });
    expect(registerUser).not.toHaveBeenCalled();
  });

  it("returns the Turnstile failure without calling the API", async () => {
    verifyTurnstile.mockResolvedValue("unexpectedError");
    await expect(registerAction("ja", undefined, form())).resolves.toEqual({
      success: false,
      messageKey: "unexpectedError",
    });
    expect(registerUser).not.toHaveBeenCalled();
  });

  const cases = [
    [new ApiError(429, "TOO_MANY_REQUESTS"), "tooManyRequests"],
    [new ApiError(500, "INTERNAL_SERVER_ERROR"), "unexpectedError"],
  ] as const;
  for (const [error, messageKey] of cases) {
    it(`returns ${messageKey} for ${error.code}`, async () => {
      registerUser.mockRejectedValue(error);
      await expect(registerAction("ja", undefined, form())).resolves.toEqual({
        success: false,
        messageKey,
      });
    });
  }

  it("rethrows errors that are not API errors", async () => {
    registerUser.mockRejectedValue(new Error("network"));
    await expect(registerAction("ja", undefined, form())).rejects.toThrow(
      "network",
    );
  });
});
