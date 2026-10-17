import { beforeEach, describe, expect, it, vi } from "vitest";

const apiFetch = vi.fn();

vi.mock("@/api/client/api-fetch", () => ({ apiFetch }));
vi.mock("@/api/client/request-json", () => ({
  jsonBody: (body: unknown, method = "POST") => ({
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }),
}));

beforeEach(() => {
  apiFetch.mockReset();
});

const { updateEmail } = await import("@/api/user/update-email");

describe("updateEmail", () => {
  it("puts the email and password to /users/email", async () => {
    apiFetch.mockResolvedValue(undefined);
    await updateEmail({ email: "user@example.com", password: "password" });
    const [path, , init] = apiFetch.mock.calls[0] ?? [];
    expect(path).toBe("/users/email");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body)).toEqual({
      email: "user@example.com",
      password: "password",
    });
  });
});
