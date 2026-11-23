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
import { SingleFlip, SpreadFlip } from "@/components/molecules/page-flip";
import { PageTurner } from "@/components/molecules/page-turner";
import { ScrapBoard } from "@/components/molecules/scrap-board";
import { AttachmentViewer } from "@/components/organisms/attachment-viewer";
import { NotebookScreen } from "@/components/organisms/notebook-screen";
import { RingNotebook } from "@/components/organisms/ring-notebook";
import { usePageKeys } from "@/hooks/use-page-keys";
import { useSwipe } from "@/hooks/use-swipe";
import { useWideScreen } from "@/hooks/use-wide-screen";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { NoteHeading } from "@/lib/note/note-headings";
import { notebookProseStyles } from "@/lib/note/prose-styles";
import { type BlockSize, paginate } from "@/lib/notebook/paginate";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";
import type { Attachment } from "@/schemas/record/attachment";

type RecordNotebookProps = {
  coverBlocks: ReactNode[];
  noteBlocks: ReactNode[];
  noteHeadings: NoteHeading[];
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
  noteHeadings,
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
  const [fadeIn, setFadeIn] = useState(true);
  const [flip, setFlip] = useState<{ from: number; dir: 1 | -1 } | null>(null);
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
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(run);
    });
    observer.observe(scroller);
    observer.observe(cover);
    observer.observe(note);
    document.fonts.ready.then(run);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
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
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      setFadeIn(reduced);
      setFlip(reduced ? null : { from: start, dir: to });
      setPageIndex(start + to * step);
      scrollRef.current?.scrollTo({ top: 0 });
      rightScrollRef.current?.scrollTo({ top: 0 });
    },
    [start, step],
  );
  const [tocOpen, setTocOpen] = useState<"top" | "bottom" | null>(null);
  const jump = (index: number) => {
    setTocOpen(null);
    if (index === start || (step === 2 && index - (index % 2) === start)) {
      return;
    }
    setDirection(index > start ? 1 : -1);
    setFadeIn(true);
    setFlip(null);
    setPageIndex(index);
    scrollRef.current?.scrollTo({ top: 0 });
    rightScrollRef.current?.scrollTo({ top: 0 });
  };
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

  const renderContent = (
    page: Page | undefined,
    index: number,
    still = false,
  ) => {
    if (!page) return null;
    const style = { "--page-shift": `${direction * 12}px` } as CSSProperties;
    const animation = still || !fadeIn ? undefined : "animate-page-in";
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

  const pageFace = (side: "left" | "right" | "single", index: number) => (
    <NotebookPage
      side={side}
      className="size-full"
      footer={pages[index] && pageNumber(index)}
    >
      {renderContent(pages[index], index, true)}
    </NotebookPage>
  );

  const endFlip = () => setFlip(null);
  const leftShown = flip?.dir === 1 ? flip.from : start;
  const rightShown = flip?.dir === -1 ? flip.from + 1 : start + 1;
  const singleShown = flip?.dir === -1 ? flip.from : start;

  const spread = (
    <RingNotebook variant="spread">
      <NotebookPage
        side="left"
        label={pageLabel(start)}
        scrollRef={layout === "spread" ? scrollRef : undefined}
        measure={layout === "spread" ? measure : undefined}
        footer={
          <>
            {pageNumber(leftShown)}
            {leftShown === 0 && coverFooter}
          </>
        }
        overlay={
          layout === "spread" &&
          flip?.dir === -1 && (
            <SpreadFlip
              dir={-1}
              front={pageFace("left", flip.from)}
              back={pageFace("right", start + 1)}
              onEnd={endFlip}
            />
          )
        }
      >
        {renderContent(pages[leftShown], leftShown)}
      </NotebookPage>
      <NotebookPage
        side="right"
        label={right ? pageLabel(start + 1) : undefined}
        scrollRef={layout === "spread" ? rightScrollRef : undefined}
        footer={pages[rightShown] && pageNumber(rightShown)}
        overlay={
          layout === "spread" &&
          flip?.dir === 1 && (
            <SpreadFlip
              dir={1}
              front={pageFace("right", flip.from + 1)}
              back={pageFace("left", start)}
              onEnd={endFlip}
            />
          )
        }
      >
        {renderContent(pages[rightShown], rightShown)}
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
        footer={pageNumber(singleShown)}
        overlay={
          layout === "single" &&
          flip && (
            <SingleFlip
              dir={flip.dir}
              page={pageFace("single", flip.dir === 1 ? flip.from : start)}
              onEnd={endFlip}
            />
          )
        }
      >
        {renderContent(pages[singleShown], singleShown)}
      </NotebookPage>
    </RingNotebook>
  );

  const noteStart = pages.findIndex((page) => page.kind === "note");
  const scrapIndex = pages.findIndex((page) => page.kind === "scrap");
  const tocEntries = [
    { key: "cover", label: dict.tocCover, index: 0, depth: 0 },
    ...(noteStart >= 0 && noteHeadings[0]?.block !== 0
      ? [{ key: "note", label: dict.tocNote, index: noteStart, depth: 0 }]
      : []),
    ...noteHeadings.map((heading) => ({
      key: `h${heading.block}`,
      label: heading.text,
      index: pages.findIndex(
        (page) => page.kind === "note" && page.blocks.includes(heading.block),
      ),
      depth: heading.level === 3 ? 1 : 0,
    })),
    ...(scrapIndex >= 0
      ? [{ key: "scrap", label: dict.tocScrap, index: scrapIndex, depth: 0 }]
      : []),
  ].filter((entry) => entry.index >= 0);
  const shownEnd = start + step - 1;

  const tocMenu = (
    <nav aria-label={dict.tocOpen}>
      <ol className="flex max-h-80 flex-col overflow-y-auto">
        {tocEntries.map((entry) => {
          const current = entry.index >= start && entry.index <= shownEnd;
          return (
            <li key={entry.key}>
              <button
                type="button"
                aria-current={current ? "page" : undefined}
                onClick={() => jump(entry.index)}
                className={cn(
                  "flex w-full items-baseline gap-2 rounded-md px-2.5 py-2 text-left text-sm outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:font-bold",
                  entry.depth === 1 && "pl-6 text-[13px]",
                )}
              >
                <span className="min-w-0 flex-1 truncate">{entry.label}</span>
                <span className="shrink-0 text-muted-foreground text-xs tabular-nums">
                  {entry.index + 1}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );

  const turner = (className: string, menuSide: "top" | "bottom") => (
    <PageTurner
      label={position}
      prevLabel={dict.prevPage}
      nextLabel={dict.nextPage}
      prev={hasPrev ? goPrev : undefined}
      next={hasNext ? goNext : undefined}
      menu={layout !== null && tocEntries.length > 1 ? tocMenu : undefined}
      menuLabel={dict.tocOpen}
      menuOpen={tocOpen === menuSide}
      onMenuOpenChange={(open) => setTocOpen(open ? menuSide : null)}
      menuSide={menuSide}
      className={className}
    />
  );

  return (
    <NotebookScreen
      toolbar={
        <>
          {back}
          <div className="flex-1" />
          {turner("hidden lg:flex", "bottom")}
          <span aria-hidden className="hidden w-2 lg:block" />
          {actions}
        </>
      }
      footer={turner("justify-center pt-2 pb-4.5 lg:hidden", "top")}
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
