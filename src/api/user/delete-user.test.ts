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

const { deleteUser } = await import("@/api/user/delete-user");

describe("deleteUser", () => {
  it("deletes /users/", async () => {
    apiFetch.mockResolvedValue(undefined);
    await deleteUser();
    expect(apiFetch.mock.calls[0]?.[0]).toBe("/users/");
    expect(apiFetch.mock.calls[0]?.[2]).toEqual({ method: "DELETE" });
  });
});
