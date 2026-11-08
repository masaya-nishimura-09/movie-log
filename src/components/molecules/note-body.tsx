import type { JSONContent } from "@tiptap/react";
import { Fragment, type ReactNode } from "react";
import { noteProseStyles } from "@/lib/note/prose-styles";
import { cn } from "@/lib/style/cn";

type NoteBodyProps = {
  content: JSONContent;
  className?: string;
};

function renderText(node: JSONContent): ReactNode {
  return (node.marks ?? []).reduce<ReactNode>((children, mark) => {
    if (mark.type === "bold") return <strong>{children}</strong>;
    if (mark.type === "italic") return <em>{children}</em>;
    return children;
  }, node.text ?? "");
}

function renderChildren(node: JSONContent): ReactNode {
  return (node.content ?? []).map((child, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: the nodes have no IDs and never reorder
    <Fragment key={index}>{renderNode(child)}</Fragment>
  ));
}

function renderNode(node: JSONContent): ReactNode {
  switch (node.type) {
    case "text":
      return renderText(node);
    case "hardBreak":
      return <br />;
    case "paragraph":
      return <p>{node.content?.length ? renderChildren(node) : <br />}</p>;
    case "heading":
      return node.attrs?.level === 3 ? (
        <h3>{renderChildren(node)}</h3>
      ) : (
        <h2>{renderChildren(node)}</h2>
      );
    case "bulletList":
      return <ul>{renderChildren(node)}</ul>;
    case "orderedList":
      return <ol>{renderChildren(node)}</ol>;
    case "listItem":
      return <li>{renderChildren(node)}</li>;
    case "blockquote":
      return <blockquote>{renderChildren(node)}</blockquote>;
    default:
      return renderChildren(node);
  }
}

export function NoteBody({ content, className }: NoteBodyProps) {
  return (
    <div className={cn("break-words", noteProseStyles, className)}>
      {renderChildren(content)}
    </div>
  );
}
