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

const { updateUsername } = await import("@/api/user/update-username");

describe("updateUsername", () => {
  it("puts the name to /users/username", async () => {
    apiFetch.mockResolvedValue(undefined);
    await updateUsername({ username: "tester" });
    const [path, , init] = apiFetch.mock.calls[0] ?? [];
    expect(path).toBe("/users/username");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body)).toEqual({ name: "tester" });
  });
});
