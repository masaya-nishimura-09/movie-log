import type { JSONContent } from "@tiptap/react";
import { z } from "zod";

export const noteContentSchema = z.custom<JSONContent>(
  (value) =>
    typeof value === "object" && value !== null && !Array.isArray(value),
);

export type Note = JSONContent;

export const noteResponseSchema = noteContentSchema;

export type NoteResponse = JSONContent;
