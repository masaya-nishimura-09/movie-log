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

const { updateUser } = await import("@/api/user/update-user");

describe("updateUser", () => {
  it("puts the user to /users/", async () => {
    apiFetch.mockResolvedValue(undefined);
    await updateUser({
      username: "tester",
      email: "user@example.com",
      password: "password",
    });
    const [path, , init] = apiFetch.mock.calls[0] ?? [];
    expect(path).toBe("/users/");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body)).toEqual({
      name: "tester",
      email: "user@example.com",
      password: "password",
    });
  });
});
