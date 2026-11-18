import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const sendContact = vi.fn();
const verifyTurnstile = vi.fn();
const logError = vi.fn();

vi.mock("@/api/contact/send-contact", () => ({ sendContact }));
vi.mock("@/lib/turnstile/verify-turnstile", () => ({ verifyTurnstile }));
vi.mock("@/lib/log/logger", () => ({ logError }));

const { sendContactAction } = await import("@/actions/contact/send-contact");

function form(fields: Record<string, string> = {}) {
  const data = new FormData();
  const values = { email: "user@example.com", message: "Hello", ...fields };
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  verifyTurnstile.mockResolvedValue(undefined);
  sendContact.mockResolvedValue(undefined);
});

describe("sendContactAction", () => {
  it("sends the trimmed message to the API with the language", async () => {
    await expect(
      sendContactAction("en", undefined, form({ message: "  Hello  " })),
    ).resolves.toEqual({ success: true, data: null });
    expect(sendContact).toHaveBeenCalledWith(
      { email: "user@example.com", message: "Hello" },
      "en",
    );
  });

  it("pretends to succeed for a bot that fills the hidden field", async () => {
    await expect(
      sendContactAction("ja", undefined, form({ website: "spam" })),
    ).resolves.toEqual({ success: true, data: null });
    expect(verifyTurnstile).not.toHaveBeenCalled();
    expect(sendContact).not.toHaveBeenCalled();
  });

  it("returns field errors for invalid input", async () => {
    await expect(
      sendContactAction("ja", undefined, form({ email: "user", message: " " })),
    ).resolves.toEqual({
      success: false,
      messageKey: "invalidInput",
      errors: { email: ["invalidEmail"], message: ["messageRequired"] },
    });
    expect(sendContact).not.toHaveBeenCalled();
  });

  it("returns the Turnstile failure without sending", async () => {
    verifyTurnstile.mockResolvedValue("verificationFailed");
    await expect(sendContactAction("ja", undefined, form())).resolves.toEqual({
      success: false,
      messageKey: "verificationFailed",
    });
    expect(sendContact).not.toHaveBeenCalled();
  });

  it("returns tooManyRequests for TOO_MANY_REQUESTS without logging", async () => {
    sendContact.mockRejectedValue(new ApiError(429, "TOO_MANY_REQUESTS"));
    await expect(sendContactAction("ja", undefined, form())).resolves.toEqual({
      success: false,
      messageKey: "tooManyRequests",
    });
    expect(logError).not.toHaveBeenCalled();
  });

  const failures = [
    new ApiError(400, "INVALID_INPUT"),
    new ApiError(500, "INTERNAL_SERVER_ERROR"),
    new Error("network"),
  ];
  for (const error of failures) {
    it(`returns unexpectedError and logs for ${error.message}`, async () => {
      sendContact.mockRejectedValue(error);
      await expect(sendContactAction("ja", undefined, form())).resolves.toEqual(
        { success: false, messageKey: "unexpectedError" },
      );
      expect(logError).toHaveBeenCalledWith(
        "error",
        "contact_send_failed",
        error,
      );
    });
  }
});
