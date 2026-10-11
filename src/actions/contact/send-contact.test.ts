import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fakeJwt } from "@/test/fake-jwt";

const cookieValues = new Map<string, string>();
const sendContactMail = vi.fn();
const verifyTurnstile = vi.fn();

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      cookieValues.has(name) ? { value: cookieValues.get(name) } : undefined,
  }),
}));
vi.mock("@/lib/contact/send-contact-mail", () => ({ sendContactMail }));
vi.mock("@/lib/turnstile/verify-turnstile", () => ({ verifyTurnstile }));

async function load(useMock = false) {
  vi.resetModules();
  vi.stubEnv("USE_MOCK", useMock ? "true" : "false");
  return (await import("@/actions/contact/send-contact")).sendContactAction;
}

function form(fields: Record<string, string> = {}) {
  const data = new FormData();
  const values = { email: "user@example.com", message: "Hello", ...fields };
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  cookieValues.clear();
  verifyTurnstile.mockResolvedValue(undefined);
  sendContactMail.mockResolvedValue(undefined);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("sendContactAction", () => {
  it("sends the mail with the language, the user and the time", async () => {
    const send = await load();
    cookieValues.set("access_token", fakeJwt({ UserID: 7 }));
    await expect(send("en", undefined, form())).resolves.toEqual({
      success: true,
      data: null,
    });
    expect(sendContactMail).toHaveBeenCalledWith(
      { email: "user@example.com", message: "Hello" },
      { lang: "en", userId: "7", receivedAt: expect.any(Date) },
    );
  });

  it("sends a guest's mail without a user ID", async () => {
    const send = await load();
    await send("ja", undefined, form());
    expect(sendContactMail.mock.calls[0]?.[1].userId).toBeUndefined();
  });

  it("pretends to succeed for a bot that fills the hidden field", async () => {
    const send = await load();
    await expect(
      send("ja", undefined, form({ website: "spam" })),
    ).resolves.toEqual({ success: true, data: null });
    expect(verifyTurnstile).not.toHaveBeenCalled();
    expect(sendContactMail).not.toHaveBeenCalled();
  });

  it("returns field errors for invalid input", async () => {
    const send = await load();
    await expect(
      send("ja", undefined, form({ email: "user", message: " " })),
    ).resolves.toEqual({
      success: false,
      messageKey: "invalidInput",
      errors: { email: ["invalidEmail"], message: ["messageRequired"] },
    });
    expect(sendContactMail).not.toHaveBeenCalled();
  });

  it("returns the Turnstile failure without sending", async () => {
    const send = await load();
    verifyTurnstile.mockResolvedValue("verificationFailed");
    await expect(send("ja", undefined, form())).resolves.toEqual({
      success: false,
      messageKey: "verificationFailed",
    });
    expect(sendContactMail).not.toHaveBeenCalled();
  });

  it("returns unexpectedError and logs when sending fails", async () => {
    const send = await load();
    sendContactMail.mockRejectedValue(new Error("Resend returned 500"));
    await expect(send("ja", undefined, form())).resolves.toEqual({
      success: false,
      messageKey: "unexpectedError",
    });
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('"event":"contact_send_failed"'),
    );
  });

  it("succeeds without verifying or sending in mock mode", async () => {
    const send = await load(true);
    await expect(send("ja", undefined, form())).resolves.toEqual({
      success: true,
      data: null,
    });
    expect(verifyTurnstile).not.toHaveBeenCalled();
    expect(sendContactMail).not.toHaveBeenCalled();
  });
});
