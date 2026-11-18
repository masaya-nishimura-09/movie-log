import { beforeEach, describe, expect, it, vi } from "vitest";

const requestJson = vi.fn();

vi.mock("@/api/client/request-json", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/api/client/request-json")>()),
  requestJson,
}));

beforeEach(() => {
  requestJson.mockReset();
});

const { sendContact } = await import("@/api/contact/send-contact");

describe("sendContact", () => {
  it("posts the email and the message to /contacts with the language", async () => {
    requestJson.mockResolvedValue(undefined);
    await sendContact({ email: "user@example.com", message: "Hello" }, "en");
    const [path, , init] = requestJson.mock.calls[0] ?? [];
    expect(path).toBe("/contacts?language=en");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      email: "user@example.com",
      message: "Hello",
    });
  });
});
