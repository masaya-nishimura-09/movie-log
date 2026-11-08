import type { JSONContent } from "@tiptap/react";

export function hasText(node: JSONContent): boolean {
  return (node.text ?? "").trim() !== "" || (node.content ?? []).some(hasText);
}
