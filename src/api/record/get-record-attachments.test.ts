import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const apiFetch = vi.fn();

vi.mock("@/api/client/api-fetch", () => ({ apiFetch }));

beforeEach(() => {
  apiFetch.mockReset();
});

const { getRecordAttachments } = await import(
  "@/api/record/get-record-attachments"
);

describe("getRecordAttachments", () => {
  it("gets /records/{id}/attachments", async () => {
    const attachments = [{ attachmentId: "1" }];
    apiFetch.mockResolvedValue(attachments);
    await expect(getRecordAttachments("1")).resolves.toEqual(attachments);
    expect(apiFetch.mock.calls[0]?.[0]).toBe("/records/1/attachments");
  });

  it("returns nothing without asking the API when the ID is not a number", async () => {
    await expect(getRecordAttachments("abc")).resolves.toEqual([]);
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("returns nothing when the record does not exist", async () => {
    apiFetch.mockRejectedValue(new ApiError(404, "RECORD_NOT_FOUND"));
    await expect(getRecordAttachments("2")).resolves.toEqual([]);
  });

  it("rethrows other errors", async () => {
    const error = new ApiError(500, "INTERNAL_SERVER_ERROR");
    apiFetch.mockRejectedValue(error);
    await expect(getRecordAttachments("3")).rejects.toBe(error);
  });
});
