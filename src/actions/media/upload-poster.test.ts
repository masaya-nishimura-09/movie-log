import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const uploadPoster = vi.fn();

vi.mock("@/api/media/upload-poster", () => ({ uploadPoster }));

const { uploadPosterAction } = await import("@/actions/media/upload-poster");

function form(file?: File | string) {
  const data = new FormData();
  if (file !== undefined) data.set("file", file);
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("uploadPosterAction", () => {
  it("uploads JPEG, PNG and WebP images", async () => {
    uploadPoster.mockResolvedValue("https://example.com/a");
    for (const type of ["image/jpeg", "image/png", "image/webp"]) {
      await expect(
        uploadPosterAction(form(new File(["x"], "a", { type }))),
      ).resolves.toEqual({ success: true, data: "https://example.com/a" });
    }
    expect(uploadPoster).toHaveBeenCalledTimes(3);
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
      await expect(uploadPosterAction(form(file))).resolves.toEqual({
        success: false,
        messageKey: "posterUploadError",
      });
    }
    expect(uploadPoster).not.toHaveBeenCalled();
  });

  it("accepts a file of exactly 5MB", async () => {
    uploadPoster.mockResolvedValue("https://example.com/a");
    const file = new File([new Uint8Array(5 * 1024 * 1024)], "a.png", {
      type: "image/png",
    });
    await expect(uploadPosterAction(form(file))).resolves.toMatchObject({
      success: true,
    });
  });

  it("returns posterUploadError on an API error and rethrows others", async () => {
    const file = new File(["x"], "a.png", { type: "image/png" });
    uploadPoster.mockRejectedValue(new ApiError(400, "INVALID_INPUT"));
    await expect(uploadPosterAction(form(file))).resolves.toEqual({
      success: false,
      messageKey: "posterUploadError",
    });
    uploadPoster.mockRejectedValue(new Error("network"));
    await expect(uploadPosterAction(form(file))).rejects.toThrow("network");
  });
});
