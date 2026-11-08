"use client";

import type { JSONContent } from "@tiptap/react";
import { useId, useLayoutEffect, useRef, useState } from "react";
import { MaskingTape } from "@/components/atoms/masking-tape";
import { NoteBody } from "@/components/molecules/note-body";
import { cn } from "@/lib/style/cn";

const collapsedHeight = 256;

const lineAligned =
  "leading-8 [&_blockquote]:mb-8 [&_h2]:mt-8 [&_h2]:mb-0 [&_h2]:leading-8 [&_h3]:mt-8 [&_h3]:mb-0 [&_h3]:leading-8 [&_li>p]:mb-0 [&_ol]:mb-8 [&_p]:mb-8 [&_ul]:mb-8";

type NoteSheetProps = {
  content: JSONContent;
  readMoreLabel: string;
  showLessLabel: string;
};

export function NoteSheet({
  content,
  readMoreLabel,
  showLessLabel,
}: NoteSheetProps) {
  const bodyId = useId();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState<boolean>();
  const [expanded, setExpanded] = useState(false);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const measure = () => setOverflows(body.scrollHeight > collapsedHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    return () => observer.disconnect();
  }, []);

  const collapsed = overflows !== false && !expanded;

  return (
    <div className="relative rounded-[3px] bg-card px-5.5 pt-5 pb-3 shadow-[0_6px_14px_-8px_rgb(10_41_71/0.45)] 2xl:px-7">
      <MaskingTape />
      <div
        id={bodyId}
        className={cn(
          "relative overflow-hidden bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_31px,var(--color-input)_31px,var(--color-input)_32px)] bg-local",
          collapsed && "max-h-64",
        )}
      >
        <div ref={bodyRef}>
          <NoteBody content={content} className={lineAligned} />
        </div>
        {collapsed && overflows && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-card"
          />
        )}
      </div>
      {overflows && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={() => setExpanded((value) => !value)}
          className="mt-1 h-8 rounded-sm font-bold text-primary text-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        >
          {expanded ? showLessLabel : readMoreLabel}
        </button>
      )}
    </div>
  );
}
