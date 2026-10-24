import type { JSONContent } from "@tiptap/react";

export type ArticleHeading = {
  id: string;
  level: 2 | 3;
  text: string;
  node: JSONContent;
};

function plainText(node: JSONContent): string {
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
