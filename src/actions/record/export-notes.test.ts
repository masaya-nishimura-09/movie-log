import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const getAllRecordsWithNotes = vi.fn();

vi.mock("@/api/record/get-all-records-with-notes", () => ({
  getAllRecordsWithNotes,
}));

const { exportNotesAction } = await import("@/actions/record/export-notes");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("exportNotesAction", () => {
  it("returns every record with its note", async () => {
    getAllRecordsWithNotes.mockResolvedValue([{ recordId: "1" }]);
    await expect(exportNotesAction()).resolves.toEqual({
      success: true,
      data: [{ recordId: "1" }],
    });
  });

  it("returns exportFailed on an API error and rethrows others", async () => {
    getAllRecordsWithNotes.mockRejectedValue(
      new ApiError(500, "INTERNAL_SERVER_ERROR"),
    );
    await expect(exportNotesAction()).resolves.toEqual({
      success: false,
      messageKey: "exportFailed",
    });
    getAllRecordsWithNotes.mockRejectedValue(new Error("network"));
    await expect(exportNotesAction()).rejects.toThrow("network");
  });
});
