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

const { deleteRecord } = await import("@/api/record/delete-record");

describe("deleteRecord", () => {
  it("deletes /records/{id}, encoding the ID", async () => {
    apiFetch.mockResolvedValue(undefined);
    await deleteRecord("a/b");
    expect(apiFetch.mock.calls[0]?.[0]).toBe("/records/a%2Fb");
    expect(apiFetch.mock.calls[0]?.[2]).toEqual({ method: "DELETE" });
  });
});
