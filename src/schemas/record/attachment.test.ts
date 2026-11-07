import { describe, expect, it } from "vitest";
import { attachmentListResponseSchema } from "@/schemas/record/attachment";

describe("attachmentListResponseSchema", () => {
  it("converts each attachment to camelCase", () => {
    expect(
      attachmentListResponseSchema.parse({
        attachments: [
          {
            attachment_id: "1",
            image_url: "/a.webp",
            created_at: "2026-08-17T01:00:00Z",
          },
        ],
      }),
    ).toEqual([
      {
        attachmentId: "1",
        imageUrl: "/a.webp",
        createdAt: "2026-08-17T01:00:00Z",
      },
    ]);
  });

  it("rejects an attachment without an image URL", () => {
    expect(
      attachmentListResponseSchema.safeParse({
        attachments: [{ attachment_id: "1", created_at: "" }],
      }).success,
    ).toBe(false);
  });
});
