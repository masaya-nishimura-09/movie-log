import type { ReactNode, Ref } from "react";
import { cn } from "@/lib/style/cn";

type NotebookPageProps = {
  side: "left" | "right" | "single";
  label?: string;
  footer?: ReactNode;
  children?: ReactNode;
  measure?: ReactNode;
  scrollRef?: Ref<HTMLDivElement>;
  className?: string;
};

const ruledLines =
  "bg-[linear-gradient(to_bottom,transparent_27px,var(--paper-line)_27px,var(--paper-line)_28px)] bg-local bg-size-[100%_28px]";

const pageEdge = {
  left: "-left-1.25 bg-[linear-gradient(to_right,#d9cfbf_0_1px,#f3ede2_1px_2px,#d9cfbf_2px_3px,#f3ede2_3px_4px,#e4dccf_4px_5px)]",
  right:
    "-right-1.25 bg-[linear-gradient(to_left,#d9cfbf_0_1px,#f3ede2_1px_2px,#d9cfbf_2px_3px,#f3ede2_3px_4px,#e4dccf_4px_5px)]",
};

export function NotebookPage({
  side,
  label,
  footer,
  children,
  measure,
  scrollRef,
  className,
}: NotebookPageProps) {
  const single = side === "single";

  return (
    <section
      aria-label={label}
      className={cn(
        "relative flex min-w-0 flex-col bg-paper text-paper-ink",
        single ? "h-full rounded-[3px]" : "h-175 flex-1 basis-0 rounded-[2px]",
        className,
      )}
    >
      {!single && (
        <div
          aria-hidden
          className={cn(
            "absolute inset-y-0.5 w-1.25 rounded-[2px]",
            pageEdge[side],
          )}
        />
      )}
      <div
        ref={scrollRef}
        className={cn(
          "relative min-h-0 flex-1 overflow-y-auto overscroll-contain",
          ruledLines,
          single ? "pt-8.5 pr-4.5 pb-7 pl-7.5" : "px-12 pt-15.5 pb-12.5",
        )}
      >
        {children}
        {measure && (
          <div
            aria-hidden
            inert
            className={cn(
              "invisible absolute top-0 h-0 overflow-hidden",
              single ? "right-4.5 left-7.5" : "inset-x-12",
            )}
          >
            {measure}
          </div>
        )}
      </div>
      {footer && (
        <div
          className={cn(
            "pointer-events-none absolute flex text-[11px] text-paper-muted tracking-[0.06em]",
            single
              ? "right-4 bottom-2 left-7.5 justify-end"
              : "right-12 bottom-4.5 left-12 justify-between",
            side === "right" && "justify-end",
          )}
        >
          {footer}
        </div>
      )}
    </section>
  );
}
