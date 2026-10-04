import type { RecordResponse } from "@/schemas/record/record";

type MockInput = Omit<
  RecordResponse,
  "created_at" | "updated_at" | "record_id"
>;

export function mock(id: number, input: MockInput): RecordResponse {
  const createdAt = new Date(input.watched_at);
  createdAt.setUTCHours(createdAt.getUTCHours() + 2);
  return {
    record_id: String(id),
    ...input,
    created_at: createdAt.toISOString(),
    updated_at: createdAt.toISOString(),
  };
}
