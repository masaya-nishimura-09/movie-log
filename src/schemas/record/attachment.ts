import { z } from "zod";

export const attachmentResponseSchema = z
  .object({
    attachment_id: z.string(),
    image_url: z.string(),
    created_at: z.string(),
  })
  .transform((a) => ({
    attachmentId: a.attachment_id,
    imageUrl: a.image_url,
    createdAt: a.created_at,
  }));

export const attachmentListResponseSchema = z
  .object({ attachments: z.array(attachmentResponseSchema) })
  .transform((r) => r.attachments);

export const maxAttachments = 10;

export type Attachment = z.output<typeof attachmentResponseSchema>;
