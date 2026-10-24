export type MockArticle = {
  article_id: string;
  record_id: string;
  title: string;
  content: object;
  created_at: string;
  updated_at: string;
};

const english = process.env.MOCK_LANGUAGE === "en";

export function t(ja: string, en: string) {
  return english ? en : ja;
}

type Mark = "bold" | "italic";

export function text(value: string, ...marks: Mark[]) {
  return {
    type: "text",
    text: value,
    ...(marks.length > 0 ? { marks: marks.map((type) => ({ type })) } : {}),
  };
}

export function doc(...blocks: object[]) {
  return { type: "doc", content: blocks };
}

export function paragraph(...parts: (string | object)[]) {
  return {
    type: "paragraph",
    content: parts.map((part) =>
      typeof part === "string" ? text(part) : part,
    ),
  };
}

export function heading(value: string, level: 2 | 3 = 2) {
  return { type: "heading", attrs: { level }, content: [text(value)] };
}

export function listItem(item: string | object, ...nested: object[]) {
  return {
    type: "listItem",
    content: [typeof item === "string" ? paragraph(item) : item, ...nested],
  };
}

export function bulletList(...items: (string | object)[]) {
  return {
    type: "bulletList",
    content: items.map((item) =>
      typeof item === "string" ? listItem(item) : item,
    ),
  };
}

export function orderedList(...items: string[]) {
  return {
    type: "orderedList",
    content: items.map((item) => listItem(item)),
  };
}

export function blockquote(value: string) {
  return { type: "blockquote", content: [paragraph(value)] };
}

export function article(
  id: number,
  recordId: number,
  createdAt: string,
  updatedAt: string,
  title: string,
  content: object,
): MockArticle {
  return {
    article_id: String(id),
    record_id: String(recordId),
    title,
    content,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}
