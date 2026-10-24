"use client";

import { ArrowUp, ChevronDown } from "lucide-react";
import { type MouseEvent, useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/molecules/popover";
import type { TocItem } from "@/components/organisms/article-toc";
import { useArticleToc } from "@/hooks/use-article-toc";
import { cn } from "@/lib/style/cn";

type ArticleTocBarProps = {
  items: TocItem[];
  label: string;
  topLabel: string;
};

const itemStyles =
  "-ml-px block w-full border-transparent border-l-2 py-2 pr-2 text-left text-sm text-muted-foreground leading-snug outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring";

export function ArticleTocBar({ items, label, topLabel }: ArticleTocBarProps) {
  const ids = useMemo(() => items.map((item) => item.id), [items]);
  const { activeId, jump, jumpToTop } = useArticleToc(ids);
  const [open, setOpen] = useState(false);
  const current = items.find((item) => item.id === activeId);

  const onJump = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    setOpen(false);
    if (jump(id)) event.preventDefault();
  };

  const toTop = () => {
    setOpen(false);
    jumpToTop();
  };

  return (
    <div className="sticky top-0 z-10 flex h-11 items-center justify-between gap-3 border-border border-b bg-background px-4 md:top-15 md:px-10 xl:hidden">
      <span className="min-w-0 truncate text-muted-foreground text-xs">
        {current?.text}
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="-mr-2 flex h-9 shrink-0 items-center gap-1 rounded-lg px-2 font-medium text-foreground-sub text-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
          {label}
          <ChevronDown
            className={cn("size-4 transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="max-h-[min(26rem,calc(100svh-8rem))] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto p-2"
        >
          <nav aria-label={label}>
            <button
              type="button"
              onClick={toTop}
              className="mb-1 flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-muted-foreground text-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowUp className="size-4" aria-hidden />
              {topLabel}
            </button>
            <ol className="flex flex-col border-border border-l">
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => onJump(event, item.id)}
                    aria-current={item.id === activeId ? "location" : undefined}
                    data-level={item.level}
                    className={cn(
                      itemStyles,
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
        </PopoverContent>
      </Popover>
    </div>
  );
}
