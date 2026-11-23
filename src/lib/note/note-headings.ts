import type { JSONContent } from "@tiptap/react";

export type NoteHeading = { block: number; level: 2 | 3; text: string };

function plainText(node: JSONContent): string {
  return (node.text ?? "") + (node.content ?? []).map(plainText).join("");
}

export function noteHeadings(nodes: JSONContent[]): NoteHeading[] {
  return nodes.flatMap((node, block) => {
    if (node.type !== "heading") return [];
    const text = plainText(node).trim();
    if (text === "") return [];
    return [{ block, level: node.attrs?.level === 3 ? 3 : 2, text }];
  });
}
