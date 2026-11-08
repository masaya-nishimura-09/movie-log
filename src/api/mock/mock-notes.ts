import { doc, paragraph } from "@/api/mock/mock-article-factory";
import { defaultArticles } from "@/api/mock/mock-articles-default";
import { demoArticles } from "@/api/mock/mock-articles-demo";
import { mockMemos } from "@/api/mock/mock-record-factory";
import { mockRecords } from "@/api/mock/mock-records";
import type { NoteResponse } from "@/schemas/record/note";

const demo = process.env.MOCK_DATASET === "demo";

function initialNotes(): Map<string, NoteResponse> {
  const articles = [...(demo ? demoArticles : defaultArticles)].sort((a, b) =>
    a.created_at.localeCompare(b.created_at),
  );
  const notes = new Map<string, NoteResponse>();
  for (const record of mockRecords) {
    const article = articles.find((a) => a.record_id === record.record_id);
    const memo = mockMemos.get(record);
    if (article) {
      notes.set(record.record_id, article.content);
    } else if (memo) {
      notes.set(record.record_id, doc(paragraph(memo)));
    }
  }
  return notes;
}

const store = globalThis as { mockNotes?: Map<string, NoteResponse> };
store.mockNotes ??= initialNotes();
export const mockNotes = store.mockNotes;
