import type { JSONContent } from "@tiptap/react";
import { localDate } from "@/lib/export/records-csv";
import { interpolate } from "@/lib/text/interpolate";
import type { Note } from "@/schemas/record/note";
import type { RecordDetail } from "@/schemas/record/record";

function escapeText(text: string): string {
  return text.replace(/[\\`*_[\]]/g, "\\$&");
}

function inline(node: JSONContent): string {
  return (node.content ?? [])
    .map((child) => {
      if (child.type === "hardBreak") return "  \n";
      if (child.type !== "text") return inline(child);
      const marks = (child.marks ?? []).map((mark) => mark.type);
      const wrap =
        (marks.includes("bold") ? "**" : "") +
        (marks.includes("italic") ? "*" : "");
      const text = escapeText(child.text ?? "");
      return wrap === ""
        ? text
        : `${wrap}${text}${[...wrap].reverse().join("")}`;
    })
    .join("");
}

function escapeLineStart(text: string): string {
  return text.replace(/^(#|>|[-+]\s|\d+\.\s)/, "\\$1");
}

function indent(text: string, prefix: string, rest: string): string {
  return text
    .split("\n")
    .map((line, index) =>
      line === "" ? "" : (index === 0 ? prefix : rest) + line,
    )
    .join("\n");
}

function list(node: JSONContent, ordered: boolean): string {
  const start = Number(node.attrs?.start ?? 1);
  return (node.content ?? [])
    .map((item, index) => {
      const marker = ordered ? `${start + index}. ` : "- ";
      const body = blocks(item.content ?? [], "\n");
      return indent(body, marker, " ".repeat(marker.length));
    })
    .join("\n");
}

function block(node: JSONContent): string {
  switch (node.type) {
    case "paragraph":
      return escapeLineStart(inline(node));
    case "heading":
      return `${"#".repeat(node.attrs?.level === 3 ? 3 : 2)} ${inline(node)}`;
    case "bulletList":
      return list(node, false);
    case "orderedList":
      return list(node, true);
    case "blockquote":
      return blocks(node.content ?? [], "\n\n")
        .split("\n")
        .map((line) => (line === "" ? ">" : `> ${line}`))
        .join("\n");
    default:
      return blocks(node.content ?? [], "\n\n");
  }
}

function blocks(nodes: JSONContent[], separator: string): string {
  return nodes
    .map(block)
    .filter((text) => text !== "")
    .join(separator);
}

export function contentToMarkdown(content: JSONContent): string {
  return blocks(content.content ?? [], "\n\n");
}

type NoteMarkdownLabels = {
  watchedAt: string;
  updatedAt: string;
  releaseYear: string;
};

type RecordWithNote = RecordDetail & { note: Note };

export function noteToMarkdown(
  record: RecordWithNote,
  labels: NoteMarkdownLabels,
): string {
  const year =
    record.releaseYear > 0
      ? ` ・ ${interpolate(labels.releaseYear, { year: record.releaseYear })}`
      : "";
  const body = contentToMarkdown(record.note);
  return `${[
    `# ${escapeText(record.title)}${year}`,
    [
      `- ${labels.watchedAt}: ${localDate(record.watchedAt)}`,
      `- ${labels.updatedAt}: ${localDate(record.updatedAt)}`,
    ].join("\n"),
    ...(body === "" ? [] : [body]),
  ].join("\n\n")}\n`;
}

const maxNameLength = 80;

function fileStem(record: RecordDetail): string {
  const title = record.title
    .replace(/[\\/:*?"<>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\.+/, "")
    .slice(0, maxNameLength)
    .trim();
  return `${localDate(record.watchedAt)} ${title}`.trim();
}

export function noteFiles(
  records: RecordDetail[],
  labels: NoteMarkdownLabels,
): { name: string; text: string }[] {
  const used = new Set<string>();
  return records
    .filter((record): record is RecordWithNote => record.note !== null)
    .map((record) => {
      const stem = fileStem(record);
      let name = `${stem}.md`;
      for (let n = 2; used.has(name.toLowerCase()); n++) {
        name = `${stem} (${n}).md`;
      }
      used.add(name.toLowerCase());
      return { name, text: noteToMarkdown(record, labels) };
    });
}
