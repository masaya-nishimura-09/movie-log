import { describe, expect, it } from "vitest";
import { mediaUploadResponseSchema } from "@/schemas/media/media";

describe("mediaUploadResponseSchema", () => {
  it("returns the URL of the uploaded file", () => {
    expect(
      mediaUploadResponseSchema.parse({ url: "https://example.com/a.png" }),
    ).toBe("https://example.com/a.png");
  });

  it("rejects a value that is not a URL", () => {
    expect(mediaUploadResponseSchema.safeParse({ url: "a.png" }).success).toBe(
      false,
    );
  });
});
