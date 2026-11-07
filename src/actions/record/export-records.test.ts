import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const getAllRecords = vi.fn();

vi.mock("@/api/record/get-all-records", () => ({ getAllRecords }));

const { exportRecordsAction } = await import("@/actions/record/export-records");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("exportRecordsAction", () => {
  it("returns every record, newest watched first", async () => {
    getAllRecords.mockResolvedValue([{ recordId: "1" }]);
    await expect(exportRecordsAction()).resolves.toEqual({
      success: true,
      data: [{ recordId: "1" }],
    });
    expect(getAllRecords).toHaveBeenCalledWith("watched_at", "desc");
  });

  it("returns exportFailed on an API error and rethrows others", async () => {
    getAllRecords.mockRejectedValue(new ApiError(500, "INTERNAL_SERVER_ERROR"));
    await expect(exportRecordsAction()).resolves.toEqual({
      success: false,
      messageKey: "exportFailed",
    });
    getAllRecords.mockRejectedValue(new Error("network"));
    await expect(exportRecordsAction()).rejects.toThrow("network");
  });
});
