import type { JSONContent } from "@tiptap/react";
import { Fragment, type ReactNode } from "react";
import { extractHeadings } from "@/lib/article/headings";
import { articleProseStyles } from "@/lib/article/prose-styles";
import { cn } from "@/lib/style/cn";

type ArticleBodyProps = {
  content: JSONContent;
  className?: string;
};

type HeadingIds = Map<JSONContent, string>;

function renderText(node: JSONContent): ReactNode {
  return (node.marks ?? []).reduce<ReactNode>((children, mark) => {
    if (mark.type === "bold") return <strong>{children}</strong>;
    if (mark.type === "italic") return <em>{children}</em>;
    return children;
  }, node.text ?? "");
}

function renderChildren(node: JSONContent, ids: HeadingIds): ReactNode {
  return (node.content ?? []).map((child, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: the nodes have no IDs and never reorder
    <Fragment key={index}>{renderNode(child, ids)}</Fragment>
  ));
}

function renderNode(node: JSONContent, ids: HeadingIds): ReactNode {
  switch (node.type) {
    case "text":
      return renderText(node);
    case "hardBreak":
      return <br />;
    case "paragraph":
      return <p>{node.content?.length ? renderChildren(node, ids) : <br />}</p>;
    case "heading":
      return node.attrs?.level === 3 ? (
        <h3 id={ids.get(node)}>{renderChildren(node, ids)}</h3>
      ) : (
        <h2 id={ids.get(node)}>{renderChildren(node, ids)}</h2>
      );
    case "bulletList":
      return <ul>{renderChildren(node, ids)}</ul>;
    case "orderedList":
      return <ol>{renderChildren(node, ids)}</ol>;
    case "listItem":
      return <li>{renderChildren(node, ids)}</li>;
    case "blockquote":
      return <blockquote>{renderChildren(node, ids)}</blockquote>;
    default:
      return renderChildren(node, ids);
  }
}

export function ArticleBody({ content, className }: ArticleBodyProps) {
  const ids: HeadingIds = new Map(
    extractHeadings(content).map(({ node, id }) => [node, id]),
  );

  return (
    <div className={cn("break-words", articleProseStyles, className)}>
      {renderChildren(content, ids)}
    </div>
  );
}
