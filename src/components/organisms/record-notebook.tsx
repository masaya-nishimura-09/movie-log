"use client";

import {
  type CSSProperties,
  Fragment,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { NotebookPage } from "@/components/molecules/notebook-page";
import { PageTurner } from "@/components/molecules/page-turner";
import { ScrapBoard } from "@/components/molecules/scrap-board";
import { AttachmentViewer } from "@/components/organisms/attachment-viewer";
import { NotebookScreen } from "@/components/organisms/notebook-screen";
import { RingNotebook } from "@/components/organisms/ring-notebook";
import { usePageKeys } from "@/hooks/use-page-keys";
import { useSwipe } from "@/hooks/use-swipe";
import { useWideScreen } from "@/hooks/use-wide-screen";
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

const coverStyles =
  "text-[13px] leading-7 lg:text-sm [&>*:not(:first-child)]:mt-7";

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
  const wide = useWideScreen();
  const layout: Layout | null =
    wide === null ? null : wide ? "spread" : "single";
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
  const hasPrev = layout !== null && start > 0;
  const hasNext = layout !== null && start + step < pages.length;

  const turn = useCallback(
    (to: 1 | -1) => {
      setDirection(to);
      setPageIndex(start + to * step);
      scrollRef.current?.scrollTo({ top: 0 });
      rightScrollRef.current?.scrollTo({ top: 0 });
    },
    [start, step],
  );
  const goPrev = useCallback(() => hasPrev && turn(-1), [hasPrev, turn]);
  const goNext = useCallback(() => hasNext && turn(1), [hasNext, turn]);

  usePageKeys(goPrev, goNext);
  const swipe = useSwipe(goPrev, goNext);

  const pageLabel = (index: number) =>
    interpolate(dict.pageLabel, { page: index + 1 });
  const total = pages.length;
  const right = layout === "single" ? undefined : pages[start + 1];
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
        <ScrapBoard
          key={index}
          style={style}
          className={animation}
          wide={layout === "spread"}
          photos={attachments.map((attachment, i) => ({
            id: attachment.attachmentId,
            imageUrl: attachment.imageUrl,
            label: interpolate(dict.attachmentOpen, { number: i + 1 }),
          }))}
          onOpen={setOpenAttachment}
        />
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
      prev={hasPrev ? goPrev : undefined}
      next={hasNext ? goNext : undefined}
      className={className}
    />
  );

  return (
    <NotebookScreen
      toolbar={
        <>
          {back}
          <div className="flex-1" />
          {turner("hidden lg:flex")}
          <span aria-hidden className="hidden w-2 lg:block" />
          {actions}
        </>
      }
      footer={turner("justify-center pt-2 pb-4.5 lg:hidden")}
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
      <AttachmentViewer
        attachments={attachments}
        index={openAttachment}
        onIndexChange={setOpenAttachment}
        onClose={() => setOpenAttachment(-1)}
        dict={dict}
        deleteDict={deleteDict}
      />
    </NotebookScreen>
  );
}
