import type { ReactNode } from "react";

type TocChapterHeadingProps = {
  children: ReactNode;
  note?: string;
};

export function TocChapterHeading({ children, note }: TocChapterHeadingProps) {
  return (
    <div className="flex h-12 items-end gap-2 pb-1 lg:h-14 lg:gap-2.5 lg:pb-1.5">
      <span
        aria-hidden="true"
        className="mb-2.25 h-0.5 w-3 shrink-0 bg-primary lg:w-4"
      />
      <h2 className="flex items-center gap-1 font-bold font-display text-base leading-5.5 lg:text-lg lg:leading-6">
        {children}
      </h2>
      {note && (
        <span className="text-[11px] text-paper-muted leading-5 lg:text-xs lg:leading-5.5">
          {note}
        </span>
      )}
    </div>
  );
}
