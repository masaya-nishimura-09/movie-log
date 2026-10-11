import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

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

const { getRecord } = await import("@/api/record/get-record");

describe("getRecord", () => {
  it("gets /records/{id}", async () => {
    apiFetch.mockResolvedValue({ recordId: "1" });
    await expect(getRecord("1")).resolves.toEqual({ recordId: "1" });
    expect(apiFetch.mock.calls[0]?.[0]).toBe("/records/1");
  });

  it("returns undefined when the record does not exist", async () => {
    apiFetch.mockRejectedValue(new ApiError(404, "RECORD_NOT_FOUND"));
    await expect(getRecord("2")).resolves.toBeUndefined();
  });

  it("rethrows other errors", async () => {
    const error = new ApiError(500, "INTERNAL_SERVER_ERROR");
    apiFetch.mockRejectedValue(error);
    await expect(getRecord("3")).rejects.toBe(error);
  });
});
