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

const { getCurrentUser } = await import("@/api/user/get-current-user");

describe("getCurrentUser", () => {
  it("gets /users/", async () => {
    apiFetch.mockResolvedValue({ username: "tester", email: "u@example.com" });
    await expect(getCurrentUser()).resolves.toEqual({
      username: "tester",
      email: "u@example.com",
    });
    expect(apiFetch.mock.calls[0]?.[0]).toBe("/users/");
  });
});
