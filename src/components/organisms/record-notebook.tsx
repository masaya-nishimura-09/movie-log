"use client";

import {
  type CSSProperties,
  Fragment,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { NotebookPage } from "@/components/molecules/notebook-page";
import { PageTurner } from "@/components/molecules/page-turner";
import { ScrapPhoto } from "@/components/molecules/scrap-photo";
import { AttachmentViewer } from "@/components/organisms/attachment-viewer";
import { RingNotebook } from "@/components/organisms/ring-notebook";
import { useSwipe } from "@/hooks/use-swipe";
import type { Dictionary } from "@/i18n/get-dictionary";
import { notebookProseStyles } from "@/lib/note/prose-styles";
import { type BlockSize, paginate } from "@/lib/notebook/paginate";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";
import type { Attachment } from "@/schemas/record/attachment";

type RecordNotebookProps = {
  coverBlocks: ReactNode[];
  noteBlocks: ReactNode[];
  coverFooter: ReactNode;
  attachments: Attachment[];
  back: ReactNode;
  actions: ReactNode;
  dict: Dictionary["recordDetail"];
  deleteDict: Dictionary["deleteAttachment"];
};

type Page =
  | { kind: "cover"; blocks: number[] }
  | { kind: "note"; blocks: number[] }
  | { kind: "scrap" };

type Layout = "spread" | "single";

type Sections = { cover: number[][]; note: number[][] };

const spreadQuery = "(min-width: 1024px)";
const coverStyles =
  "text-[13px] leading-7 lg:text-sm [&>*:not(:first-child)]:mt-7";

function subscribeLayout(onChange: () => void) {
  const query = window.matchMedia(spreadQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useLayout(): Layout | null {
  return useSyncExternalStore(
    subscribeLayout,
    () => (window.matchMedia(spreadQuery).matches ? "spread" : "single"),
    () => null,
  );
}

function measureBlocks(container: HTMLElement): BlockSize[] {
  const children = Array.from(container.children) as HTMLElement[];
  return children.map((child, index) => {
    const next = children[index + 1];
    const marginBottom = Number.parseFloat(
      getComputedStyle(child).marginBottom,
    );
    return {
      height: child.offsetHeight,
      advance: next
        ? next.offsetTop - child.offsetTop
        : child.offsetHeight + marginBottom,
      keepWithNext: /^H[2-6]$/.test(child.tagName),
    };
  });
}

function contentHeight(scroller: HTMLElement): number {
  const style = getComputedStyle(scroller);
  return (
    scroller.clientHeight -
    Number.parseFloat(style.paddingTop) -
    Number.parseFloat(style.paddingBottom)
  );
}

function isTyping(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    target.closest(
      "input, textarea, select, [contenteditable='true'], [role='dialog'], [role='alertdialog']",
    ) !== null
  );
}

export function RecordNotebook({
  coverBlocks,
  noteBlocks,
  coverFooter,
  attachments,
  back,
  actions,
  dict,
  deleteDict,
}: RecordNotebookProps) {
  const layout = useLayout();
  const [sections, setSections] = useState<Sections>(() => ({
    cover: [coverBlocks.map((_, index) => index)],
    note: noteBlocks.length > 0 ? [noteBlocks.map((_, index) => index)] : [],
  }));
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [openAttachment, setOpenAttachment] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const coverMeasureRef = useRef<HTMLDivElement>(null);
  const noteMeasureRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scroller = scrollRef.current;
    const cover = coverMeasureRef.current;
    const note = noteMeasureRef.current;
    if (!layout || !scroller || !cover || !note) return;
    const run = () => {
      const capacity = contentHeight(scroller);
      const next = {
        cover: paginate(measureBlocks(cover), capacity),
        note: paginate(measureBlocks(note), capacity),
      };
      setSections((current) =>
        JSON.stringify(current) === JSON.stringify(next) ? current : next,
      );
    };
    run();
    const observer = new ResizeObserver(run);
    observer.observe(scroller);
    observer.observe(cover);
    observer.observe(note);
    document.fonts.ready.then(run);
    return () => observer.disconnect();
  }, [layout]);

  const pages: Page[] = [
    ...sections.cover.map((blocks) => ({ kind: "cover" as const, blocks })),
    ...sections.note.map((blocks) => ({ kind: "note" as const, blocks })),
    ...(attachments.length > 0 ? [{ kind: "scrap" as const }] : []),
  ];
  const step = layout === "spread" ? 2 : 1;
  const lastStart = Math.max(0, pages.length - 1);
  const start = Math.min(
    pageIndex - (pageIndex % step),
    lastStart - (lastStart % step),
  );
  const hasPrev = start > 0;
  const hasNext = start + step < pages.length;

  const turn = useCallback(
    (to: 1 | -1) => {
      setDirection(to);
      setPageIndex(start + to * step);
      scrollRef.current?.scrollTo({ top: 0 });
      rightScrollRef.current?.scrollTo({ top: 0 });
    },
    [start, step],
  );
  const goPrev = hasPrev ? () => turn(-1) : undefined;
  const goNext = hasNext ? () => turn(1) : undefined;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (isTyping(event.target)) return;
      if (event.key === "ArrowLeft" && hasPrev) turn(-1);
      if (event.key === "ArrowRight" && hasNext) turn(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hasPrev, hasNext, turn]);

  const swipe = useSwipe(goPrev, goNext);

  const pageLabel = (index: number) =>
    interpolate(dict.pageLabel, { page: index + 1 });
  const total = pages.length;
  const right = layout === "spread" ? pages[start + 1] : undefined;
  const position = right
    ? interpolate(dict.pageSpread, {
        start: start + 1,
        end: start + 2,
        total,
      })
    : interpolate(dict.pagePosition, { page: start + 1, total });

  const renderContent = (page: Page | undefined, index: number) => {
    if (!page) return null;
    const style = { "--page-shift": `${direction * 12}px` } as CSSProperties;
    const animation = "animate-page-in";
    if (page.kind === "scrap") {
      return (
        <ul
          key={index}
          style={style}
          className={cn(
            animation,
            "grid grid-cols-2 gap-x-3.5 gap-y-6.5 pt-1.5 lg:gap-x-5 lg:gap-y-9 lg:pt-0",
            attachments.length > 6 ? "lg:grid-cols-4" : "lg:grid-cols-3",
          )}
        >
          {attachments.map((attachment, i) => (
            <li key={attachment.attachmentId}>
              <ScrapPhoto
                imageUrl={attachment.imageUrl}
                label={interpolate(dict.attachmentOpen, { number: i + 1 })}
                onOpen={() => setOpenAttachment(i)}
              />
            </li>
          ))}
        </ul>
      );
    }
    const blocks = page.kind === "cover" ? coverBlocks : noteBlocks;
    return (
      <div
        key={index}
        style={style}
        className={cn(
          animation,
          page.kind === "cover" ? coverStyles : notebookProseStyles,
        )}
      >
        {page.blocks.map((block) => (
          <Fragment key={block}>{blocks[block]}</Fragment>
        ))}
      </div>
    );
  };

  const measure = (
    <>
      <div ref={coverMeasureRef} className={cn("relative", coverStyles)}>
        {coverBlocks.map((block, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: the blocks never reorder
          <Fragment key={index}>{block}</Fragment>
        ))}
      </div>
      <div ref={noteMeasureRef} className={cn("relative", notebookProseStyles)}>
        {noteBlocks.map((block, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: the blocks never reorder
          <Fragment key={index}>{block}</Fragment>
        ))}
      </div>
    </>
  );

  const pageNumber = (index: number) => (
    <span className="tabular-nums">{index + 1}</span>
  );

  const spread = (
    <RingNotebook variant="spread">
      <NotebookPage
        side="left"
        label={pageLabel(start)}
        scrollRef={layout === "spread" ? scrollRef : undefined}
        measure={layout === "spread" ? measure : undefined}
        footer={
          <>
            {pageNumber(start)}
            {start === 0 && coverFooter}
          </>
        }
      >
        {renderContent(pages[start], start)}
      </NotebookPage>
      <NotebookPage
        side="right"
        label={right ? pageLabel(start + 1) : undefined}
        scrollRef={layout === "spread" ? rightScrollRef : undefined}
        footer={right && pageNumber(start + 1)}
      >
        {renderContent(right, start + 1)}
      </NotebookPage>
    </RingNotebook>
  );

  const single = (
    <RingNotebook variant="single" className="h-full">
      <NotebookPage
        side="single"
        label={pageLabel(start)}
        scrollRef={layout === "single" ? scrollRef : undefined}
        measure={layout === "single" ? measure : undefined}
        footer={pageNumber(start)}
      >
        {renderContent(pages[start], start)}
      </NotebookPage>
    </RingNotebook>
  );

  const turner = (className: string) => (
    <PageTurner
      label={position}
      prevLabel={dict.prevPage}
      nextLabel={dict.nextPage}
      onPrev={goPrev}
      onNext={goNext}
      className={className}
    />
  );

  return (
    <div className="mx-auto flex w-full max-w-296 flex-col max-lg:h-[calc(100svh-var(--app-header-height)-env(safe-area-inset-bottom))] md:max-lg:max-w-2xl lg:px-8 lg:pb-6">
      <div className="flex flex-wrap items-center gap-1.5 px-4 pt-1.5 pb-2.5 lg:gap-3 lg:px-0 lg:py-4">
        {back}
        <div className="flex-1" />
        {turner("hidden lg:flex")}
        <span aria-hidden className="hidden w-2 lg:block" />
        {actions}
      </div>
      <div
        className="min-h-0 flex-1 touch-pan-y lg:flex-none"
        onPointerDown={swipe.onPointerDown}
        onPointerUp={swipe.onPointerUp}
      >
        {layout === null ? (
          <>
            <div className="hidden lg:block">{spread}</div>
            <div className="h-full lg:hidden">{single}</div>
          </>
        ) : layout === "spread" ? (
          spread
        ) : (
          single
        )}
      </div>
      {turner("justify-center pt-2 pb-4.5 lg:hidden")}
      <AttachmentViewer
        attachments={attachments}
        index={openAttachment}
        onIndexChange={setOpenAttachment}
        onClose={() => setOpenAttachment(-1)}
        dict={dict}
        deleteDict={deleteDict}
      />
    </div>
  );
}
