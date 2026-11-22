import type { ReactNode } from "react";
import { NotebookPage } from "@/components/molecules/notebook-page";
import { NotebookScreen } from "@/components/organisms/notebook-screen";
import { RingNotebook } from "@/components/organisms/ring-notebook";
import { cn } from "@/lib/style/cn";

function Bar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("block rounded-sm bg-[rgb(10_41_71/0.08)]", className)}
    />
  );
}

function Line({ className }: { className?: string }) {
  return (
    <div className="flex h-7 items-center">
      <Bar className={cn("h-3", className)} />
    </div>
  );
}

function TocHeader() {
  return (
    <div className="flex h-16 flex-col justify-end gap-2 pb-1 lg:h-21 lg:pb-2">
      <Bar className="h-2.5 w-20" />
      <Bar className="h-7 w-36 lg:h-9 lg:w-52" />
    </div>
  );
}

function TocChapter() {
  return (
    <div className="flex h-12 items-end pb-2 lg:h-14">
      <Bar className="h-3.5 w-24" />
    </div>
  );
}

function TocRow({ width }: { width: string }) {
  return (
    <div className="flex h-14 items-center gap-2.5 lg:gap-3">
      <Bar className="h-11 w-7.5 shrink-0 rounded-none lg:h-11.5 lg:w-8" />
      <div className="flex flex-1 flex-col gap-2">
        <Bar className={cn("h-3.5", width)} />
        <Bar className="h-2.5 w-1/4" />
      </div>
    </div>
  );
}

const rowWidths = ["w-3/5", "w-2/5", "w-2/3", "w-1/2", "w-3/5", "w-2/5"];

function Fields({ count }: { count: number }) {
  return (
    <div>
      {Array.from({ length: count }, (_, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: placeholders never reorder
          key={index}
          className="flex h-7 items-center gap-2 lg:gap-3"
        >
          <Bar className="h-2.5 w-10 lg:w-12" />
          <Bar className={cn("h-3", index % 2 === 0 ? "w-28" : "w-20")} />
        </div>
      ))}
    </div>
  );
}

function CoverHeader() {
  return (
    <div className="flex flex-wrap items-start gap-3.5 lg:gap-7">
      <Bar className="h-39 w-26 shrink-0 rounded-none lg:h-56 lg:w-38" />
      <div className="min-w-0 flex-1 basis-40">
        <div className="flex h-7 items-center lg:h-10">
          <Bar className="h-4.5 w-3/4 lg:h-6" />
        </div>
        <Line className="h-2.5 w-1/2" />
        <div className="lg:mt-7">
          <Fields count={4} />
        </div>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="flex h-7 items-center gap-2 lg:gap-2.5">
      <span aria-hidden className="h-0.5 w-3 shrink-0 bg-primary lg:w-4" />
      <Bar className="h-3.5 w-24" />
    </div>
  );
}

function Paragraph({ lines }: { lines: string[] }) {
  return (
    <div>
      {lines.map((width, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: placeholders never reorder
        <Line key={index} className={width} />
      ))}
    </div>
  );
}

function Loading({ children }: { children: ReactNode }) {
  return (
    <output aria-busy className="block animate-pulse">
      {children}
    </output>
  );
}

function LoadingScreen({
  left,
  right,
  single,
}: {
  left: ReactNode;
  right: ReactNode;
  single: ReactNode;
}) {
  return (
    <NotebookScreen
      toolbar={<div className="h-11 lg:h-10" />}
      footer={<div aria-hidden className="h-17.5 lg:hidden" />}
    >
      <RingNotebook variant="spread" className="hidden lg:flex">
        <NotebookPage side="left">
          <Loading>{left}</Loading>
        </NotebookPage>
        <NotebookPage side="right">
          <Loading>{right}</Loading>
        </NotebookPage>
      </RingNotebook>
      <RingNotebook variant="single" className="h-full lg:hidden">
        <NotebookPage side="single">
          <Loading>{single}</Loading>
        </NotebookPage>
      </RingNotebook>
    </NotebookScreen>
  );
}

function TocPage({
  first = false,
  chapter = first,
  rows,
}: {
  first?: boolean;
  chapter?: boolean;
  rows: string[];
}) {
  return (
    <>
      {first && <TocHeader />}
      {chapter && <TocChapter />}
      {rows.map((width, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: placeholders never reorder
        <TocRow key={index} width={width} />
      ))}
    </>
  );
}

export function TocPageLoading({
  side,
  first,
}: {
  side: "left" | "right" | "single";
  first: boolean;
}) {
  return (
    <Loading>
      {side === "right" ? (
        <TocPage rows={rowWidths.slice(2, 6)} />
      ) : (
        <TocPage
          first={first}
          chapter
          rows={side === "single" ? rowWidths : rowWidths.slice(0, 4)}
        />
      )}
    </Loading>
  );
}

export function ListLoading() {
  return (
    <LoadingScreen
      left={<TocPage first rows={rowWidths.slice(0, 4)} />}
      right={<TocPage rows={rowWidths.slice(2, 6)} />}
      single={<TocPage first rows={rowWidths} />}
    />
  );
}

export function DetailLoading() {
  return (
    <LoadingScreen
      left={
        <>
          <CoverHeader />
          <div className="mt-7">
            <Heading />
            <Fields count={4} />
          </div>
        </>
      }
      right={
        <>
          <Heading />
          <Paragraph lines={["w-full", "w-11/12", "w-full", "w-2/3"]} />
          <div className="mt-7">
            <Heading />
            <Paragraph lines={["w-full", "w-full", "w-5/6", "w-1/2"]} />
          </div>
        </>
      }
      single={<CoverHeader />}
    />
  );
}
