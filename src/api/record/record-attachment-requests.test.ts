import { beforeEach, describe, expect, it, vi } from "vitest";

const apiFetch = vi.fn();

vi.mock("@/api/client/api-fetch", () => ({ apiFetch }));

beforeEach(() => {
  apiFetch.mockReset();
});

const { addRecordAttachment } = await import(
  "@/api/record/add-record-attachment"
);
const { deleteRecordAttachment } = await import(
  "@/api/record/delete-record-attachment"
);

describe("addRecordAttachment", () => {
  it("posts the file to /records/{id}/attachments", async () => {
    apiFetch.mockResolvedValue({ attachmentId: "1" });
    const file = new File(["x"], "a.png", { type: "image/png" });
    await expect(addRecordAttachment("3", file)).resolves.toEqual({
      attachmentId: "1",
    });
    const [path, , init] = apiFetch.mock.calls[0] ?? [];
    expect(path).toBe("/records/3/attachments");
    expect(init.method).toBe("POST");
    expect(init.body.get("file")).toBe(file);
  });
});

describe("deleteRecordAttachment", () => {
  it("deletes /records/{id}/attachments/{attachmentId}", async () => {
    apiFetch.mockResolvedValue(undefined);
    await deleteRecordAttachment("3", "9");
    const [path, , init] = apiFetch.mock.calls[0] ?? [];
    expect(path).toBe("/records/3/attachments/9");
    expect(init.method).toBe("DELETE");
  });
});
