import type { RecordResponse } from "@/schemas/record/record";

type MockInput = Omit<
  RecordResponse,
  "created_at" | "updated_at" | "record_id"
> & { memo: string };

export const mockMemos = new WeakMap<RecordResponse, string>();

export function mock(
  id: number,
  { memo, ...input }: MockInput,
): RecordResponse {
  const createdAt = new Date(input.watched_at);
  createdAt.setUTCHours(createdAt.getUTCHours() + 2);
  const record = {
    record_id: String(id),
    ...input,
    created_at: createdAt.toISOString(),
    updated_at: createdAt.toISOString(),
  };
  if (memo !== "") mockMemos.set(record, memo);
  return record;
}
