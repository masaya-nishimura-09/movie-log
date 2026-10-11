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

const { uploadPoster } = await import("@/api/media/upload-poster");

describe("uploadPoster", () => {
  it("posts the file to /media/ as form data", async () => {
    apiFetch.mockResolvedValue("https://example.com/a.png");
    const file = new File(["png"], "a.png", { type: "image/png" });
    await expect(uploadPoster(file)).resolves.toBe("https://example.com/a.png");
    const [path, , init] = apiFetch.mock.calls[0] ?? [];
    expect(path).toBe("/media/");
    expect(init.method).toBe("POST");
    expect(init.body.get("file")).toBeInstanceOf(File);
    expect(init.body.get("file").name).toBe("a.png");
  });
});
