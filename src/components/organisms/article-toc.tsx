"use client";

import { type MouseEvent, useMemo } from "react";
import { useArticleToc } from "@/hooks/use-article-toc";
import type { ArticleHeading } from "@/lib/article/headings";
import { cn } from "@/lib/style/cn";

export type TocItem = Omit<ArticleHeading, "node">;

type ArticleTocProps = {
  items: TocItem[];
  label: string;
};

export function ArticleToc({ items, label }: ArticleTocProps) {
  const ids = useMemo(() => items.map((item) => item.id), [items]);
  const { activeId, jump } = useArticleToc(ids);

  const onJump = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (jump(id)) event.preventDefault();
  };

  return (
    <nav aria-label={label} className="flex flex-col gap-2.5">
      <h2 className="font-bold text-muted-foreground text-xs tracking-[0.08em]">
        {label}
      </h2>
      <ol className="flex max-h-[calc(100svh-17rem)] flex-col overflow-y-auto border-border border-l">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(event) => onJump(event, item.id)}
              aria-current={item.id === activeId ? "location" : undefined}
              data-level={item.level}
              className={cn(
                "-ml-px block border-transparent border-l-2 py-1.5 pr-2 text-[13px] text-muted-foreground leading-snug outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                item.level === 3 ? "pl-6" : "pl-3",
                item.id === activeId &&
                  "border-primary font-medium text-foreground",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
