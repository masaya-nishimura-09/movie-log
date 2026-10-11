import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const deleteRecord = vi.fn();

vi.mock("next/navigation", () => import("@/test/next-navigation"));
vi.mock("@/api/record/delete-record", () => ({ deleteRecord }));

const { deleteRecordAction } = await import("@/actions/record/delete-record");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("deleteRecordAction", () => {
  it("deletes the record and moves to the records", async () => {
    deleteRecord.mockResolvedValue(undefined);
    await expect(deleteRecordAction("en", "1")).rejects.toThrow(
      "REDIRECT /en/records",
    );
    expect(deleteRecord).toHaveBeenCalledWith("1");
  });

  it("moves to the records when the record is already gone", async () => {
    deleteRecord.mockRejectedValue(new ApiError(404, "RECORD_NOT_FOUND"));
    await expect(deleteRecordAction("ja", "1")).rejects.toThrow(
      "REDIRECT /ja/records",
    );
  });

  it("returns unexpectedError on other API errors", async () => {
    deleteRecord.mockRejectedValue(new ApiError(500, "INTERNAL_SERVER_ERROR"));
    await expect(deleteRecordAction("ja", "1")).resolves.toEqual({
      success: false,
      messageKey: "unexpectedError",
    });
  });

  it("rethrows errors that are not API errors", async () => {
    deleteRecord.mockRejectedValue(new Error("network"));
    await expect(deleteRecordAction("ja", "1")).rejects.toThrow("network");
  });
});
