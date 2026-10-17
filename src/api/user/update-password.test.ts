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

const { updatePassword } = await import("@/api/user/update-password");

describe("updatePassword", () => {
  it("puts the old and new passwords to /users/password", async () => {
    apiFetch.mockResolvedValue(undefined);
    await updatePassword({
      oldPassword: "old-pass1",
      newPassword: "new-pass2",
    });
    const [path, , init] = apiFetch.mock.calls[0] ?? [];
    expect(path).toBe("/users/password");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body)).toEqual({
      old_password: "old-pass1",
      new_password: "new-pass2",
    });
  });
});
