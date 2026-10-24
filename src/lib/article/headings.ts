import type { JSONContent } from "@tiptap/react";

export type ArticleHeading = {
  id: string;
  level: 2 | 3;
  text: string;
  node: JSONContent;
};

export function plainText(node: JSONContent): string {
  return node.text ?? (node.content ?? []).map(plainText).join("");
}

export function extractHeadings(content: JSONContent): ArticleHeading[] {
  const headings: ArticleHeading[] = [];

  function visit(node: JSONContent) {
    if (node.type === "heading") {
      const text = plainText(node).trim();
      if (text !== "") {
        headings.push({
          id: `section-${headings.length + 1}`,
          level: node.attrs?.level === 3 ? 3 : 2,
          text,
          node,
        });
      }
    }
    for (const child of node.content ?? []) visit(child);
  }

  visit(content);
  return headings;
}

export function firstParagraphText(content: JSONContent): string {
  function find(node: JSONContent): string | undefined {
    if (node.type === "paragraph") {
      const text = plainText(node).trim();
      return text === "" ? undefined : text;
    }
    for (const child of node.content ?? []) {
      const found = find(child);
      if (found !== undefined) return found;
    }
    return undefined;
  }
  return find(content) ?? "";
}
