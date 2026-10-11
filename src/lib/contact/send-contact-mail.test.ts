import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendContactMail } from "@/lib/contact/send-contact-mail";

const fetchMock = vi.fn();
const input = { email: "user@example.com", message: "Hello" };
const context = {
  lang: "ja" as const,
  userId: undefined,
  receivedAt: new Date("2026-10-10T15:30:00Z"),
};

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("RESEND_API_KEY", "resend-key");
  vi.stubEnv("CONTACT_TO_EMAIL", "support@example.com");
  vi.stubEnv("CONTACT_FROM_EMAIL", "");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("sendContactMail", () => {
  it("sends the mail through Resend with the sender as reply-to", async () => {
    fetchMock.mockResolvedValue(Response.json({ id: "1" }));
    vi.stubEnv("CONTACT_FROM_EMAIL", "Cinelog <contact@example.com>");
    await sendContactMail(input, context);
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({
      Authorization: "Bearer resend-key",
      "Content-Type": "application/json",
    });
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({
      from: "Cinelog <contact@example.com>",
      to: ["support@example.com"],
      reply_to: "user@example.com",
    });
    expect(body.subject).toMatch(/^\[Cinelog お問い合わせ\] #CL-20261011-/);
    expect(body.html).toContain("Hello");
    expect(body.text).toContain("Hello");
  });

  it("uses the Resend test sender by default", async () => {
    fetchMock.mockResolvedValue(Response.json({ id: "1" }));
    vi.unstubAllEnvs();
    vi.stubEnv("RESEND_API_KEY", "resend-key");
    vi.stubEnv("CONTACT_TO_EMAIL", "support@example.com");
    delete process.env.CONTACT_FROM_EMAIL;
    await sendContactMail(input, context);
    expect(JSON.parse(fetchMock.mock.calls[0]?.[1].body).from).toBe(
      "Cinelog <onboarding@resend.dev>",
    );
  });

  it("throws when Resend responds with an error", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 422 }));
    await expect(sendContactMail(input, context)).rejects.toThrow(
      "Resend returned 422",
    );
  });

  it("throws when the API key or the recipient is not set", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    await expect(sendContactMail(input, context)).rejects.toThrow(
      "RESEND_API_KEY is not set",
    );
    vi.stubEnv("RESEND_API_KEY", "resend-key");
    vi.stubEnv("CONTACT_TO_EMAIL", "");
    await expect(sendContactMail(input, context)).rejects.toThrow(
      "CONTACT_TO_EMAIL is not set",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
