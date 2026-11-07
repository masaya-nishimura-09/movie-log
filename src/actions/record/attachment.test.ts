import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const addRecordAttachment = vi.fn();
const deleteRecordAttachment = vi.fn();
const refresh = vi.fn();

vi.mock("next/cache", () => ({ refresh }));
vi.mock("@/api/record/add-record-attachment", () => ({ addRecordAttachment }));
vi.mock("@/api/record/delete-record-attachment", () => ({
  deleteRecordAttachment,
}));

const { addAttachmentAction, deleteAttachmentAction } = await import(
  "@/actions/record/attachment"
);

function form(file?: File | string) {
  const data = new FormData();
  if (file !== undefined) data.set("file", file);
  return data;
}

const png = () => new File(["x"], "a.png", { type: "image/png" });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("addAttachmentAction", () => {
  it("attaches JPEG, PNG and WebP images to the record and refreshes the page", async () => {
    addRecordAttachment.mockResolvedValue({ attachmentId: "1" });
    for (const type of ["image/jpeg", "image/png", "image/webp"]) {
      const file = new File(["x"], "a", { type });
      await expect(addAttachmentAction("3", form(file))).resolves.toEqual({
        success: true,
        data: null,
      });
      expect(addRecordAttachment).toHaveBeenLastCalledWith("3", file);
    }
    expect(refresh).toHaveBeenCalledTimes(3);
  });

  it("rejects a missing, empty, too large or non-image file without uploading", async () => {
    const files = [
      undefined,
      "text",
      new File([], "a.png", { type: "image/png" }),
      new File([new Uint8Array(5 * 1024 * 1024 + 1)], "a.png", {
        type: "image/png",
      }),
      new File(["x"], "a.gif", { type: "image/gif" }),
    ];
    for (const file of files) {
      await expect(addAttachmentAction("3", form(file))).resolves.toEqual({
        success: false,
        messageKey: "attachmentsUploadError",
      });
    }
    expect(addRecordAttachment).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
  });

  it("returns attachmentsUploadError on an API error and rethrows others", async () => {
    addRecordAttachment.mockRejectedValue(new ApiError(400, "INVALID_INPUT"));
    await expect(addAttachmentAction("3", form(png()))).resolves.toEqual({
      success: false,
      messageKey: "attachmentsUploadError",
    });
    addRecordAttachment.mockRejectedValue(new Error("network"));
    await expect(addAttachmentAction("3", form(png()))).rejects.toThrow(
      "network",
    );
    expect(refresh).not.toHaveBeenCalled();
  });
});

describe("deleteAttachmentAction", () => {
  it("deletes the attachment and refreshes the page", async () => {
    deleteRecordAttachment.mockResolvedValue(undefined);
    await expect(deleteAttachmentAction("3", "9")).resolves.toEqual({
      success: true,
      data: null,
    });
    expect(deleteRecordAttachment).toHaveBeenCalledWith("3", "9");
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("treats an attachment that is already gone as deleted", async () => {
    deleteRecordAttachment.mockRejectedValue(
      new ApiError(404, "ATTACHMENT_NOT_FOUND"),
    );
    await expect(deleteAttachmentAction("3", "9")).resolves.toEqual({
      success: true,
      data: null,
    });
  });

  it("returns unexpectedError on other API errors and rethrows others", async () => {
    deleteRecordAttachment.mockRejectedValue(
      new ApiError(500, "INTERNAL_SERVER_ERROR"),
    );
    await expect(deleteAttachmentAction("3", "9")).resolves.toEqual({
      success: false,
      messageKey: "unexpectedError",
    });
    deleteRecordAttachment.mockRejectedValue(new Error("network"));
    await expect(deleteAttachmentAction("3", "9")).rejects.toThrow("network");
    expect(refresh).not.toHaveBeenCalled();
  });
});
