import { beforeEach, describe, expect, it, vi } from "vitest";

const requestJson = vi.fn();

vi.mock("@/api/client/request-json", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/api/client/request-json")>()),
  requestJson,
}));

beforeEach(() => {
  requestJson.mockReset();
});

const { registerUser } = await import("@/api/user/register-user");

describe("registerUser", () => {
  it("posts the user to /users/register without the access token", async () => {
    requestJson.mockResolvedValue(undefined);
    await registerUser({
      username: "tester",
      email: "user@example.com",
      password: "password",
    });
    const [path, , init] = requestJson.mock.calls[0] ?? [];
    expect(path).toBe("/users/register");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      name: "tester",
      email: "user@example.com",
      password: "password",
    });
  });
});
