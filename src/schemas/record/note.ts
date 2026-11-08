import type { JSONContent } from "@tiptap/react";
import { z } from "zod";

export const noteContentSchema = z.custom<JSONContent>(
  (value) =>
    typeof value === "object" && value !== null && !Array.isArray(value),
);

const noteSchema = z.object({
  content: noteContentSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Note = z.infer<typeof noteSchema>;

export const noteResponseSchema = z
  .object({
    content: noteContentSchema,
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
  })
  .transform(
    (n): Note => ({
      content: n.content,
      createdAt: n.created_at,
      updatedAt: n.updated_at,
    }),
  );

export type NoteResponse = z.input<typeof noteResponseSchema>;
