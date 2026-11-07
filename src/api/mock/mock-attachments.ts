type MockAttachment = {
  attachment_id: string;
  record_id: string;
  image_url: string;
  created_at: string;
};

function attachment(
  id: number,
  recordId: number,
  name: string,
  createdAt: string,
): MockAttachment {
  return {
    attachment_id: String(id),
    record_id: String(recordId),
    image_url: `/mock-attachments/${name}.webp`,
    created_at: createdAt,
  };
}

const initialAttachments: MockAttachment[] = [
  attachment(1, 1, "pamphlet-1", "2026-08-17T01:00:00Z"),
  attachment(2, 1, "pamphlet-2", "2026-08-17T01:01:00Z"),
  attachment(3, 1, "sketch", "2026-08-18T12:00:00Z"),
  attachment(4, 1, "flyer", "2026-08-20T09:00:00Z"),
  attachment(5, 2, "flyer", "2026-08-15T10:00:00Z"),
];

const store = globalThis as { mockAttachments?: MockAttachment[] };
store.mockAttachments ??= initialAttachments;
export const mockAttachments = store.mockAttachments;
