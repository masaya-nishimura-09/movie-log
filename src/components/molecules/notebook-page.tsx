import type { ReactNode, Ref } from "react";
import { cn } from "@/lib/style/cn";

type Side = "left" | "right" | "single" | "auto-left" | "auto-right";

type NotebookPageProps = {
  side: Side;
  label?: string;
  footer?: ReactNode;
  children?: ReactNode;
  measure?: ReactNode;
  scrollRef?: Ref<HTMLDivElement>;
  className?: string;
};

const ruledLines =
  "bg-[linear-gradient(to_bottom,transparent_27px,var(--paper-line)_27px,var(--paper-line)_28px)] bg-local bg-size-[100%_28px]";

const leftEdge =
  "-left-1.25 bg-[linear-gradient(to_right,#d9cfbf_0_1px,#f3ede2_1px_2px,#d9cfbf_2px_3px,#f3ede2_3px_4px,#e4dccf_4px_5px)]";
const rightEdge =
  "-right-1.25 bg-[linear-gradient(to_left,#d9cfbf_0_1px,#f3ede2_1px_2px,#d9cfbf_2px_3px,#f3ede2_3px_4px,#e4dccf_4px_5px)]";

const styles: Record<
  Side,
  {
    page: string;
    edge?: string;
    scroll: string;
    measure: string;
    footer: string;
  }
> = {
  single: {
    page: "h-full rounded-[3px]",
    scroll: "pt-8.5 pr-4.5 pb-7 pl-7.5",
    measure: "right-4.5 left-7.5",
    footer: "right-4 bottom-2 left-7.5 justify-end",
  },
  left: {
    page: "h-175 flex-1 basis-0 rounded-[2px]",
    edge: leftEdge,
    scroll: "px-12 pt-15.5 pb-12.5",
    measure: "inset-x-12",
    footer: "right-12 bottom-4.5 left-12 justify-between",
  },
  right: {
    page: "h-175 flex-1 basis-0 rounded-[2px]",
    edge: rightEdge,
    scroll: "px-12 pt-15.5 pb-12.5",
    measure: "inset-x-12",
    footer: "right-12 bottom-4.5 left-12 justify-end",
  },
  "auto-left": {
    page: "h-full rounded-[3px] lg:h-175 lg:flex-1 lg:basis-0 lg:rounded-[2px]",
    edge: `hidden lg:block ${leftEdge}`,
    scroll: "pt-8.5 pr-4.5 pb-7 pl-7.5 lg:px-12 lg:pt-15.5 lg:pb-12.5",
    measure: "right-4.5 left-7.5 lg:inset-x-12",
    footer:
      "right-4 bottom-2 left-7.5 justify-end lg:right-12 lg:bottom-4.5 lg:left-12 lg:justify-between",
  },
  "auto-right": {
    page: "h-full rounded-[3px] lg:h-175 lg:flex-1 lg:basis-0 lg:rounded-[2px]",
    edge: `hidden lg:block ${rightEdge}`,
    scroll: "pt-8.5 pr-4.5 pb-7 pl-7.5 lg:px-12 lg:pt-15.5 lg:pb-12.5",
    measure: "right-4.5 left-7.5 lg:inset-x-12",
    footer:
      "right-4 bottom-2 left-7.5 justify-end lg:right-12 lg:bottom-4.5 lg:left-12",
  },
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
  const style = styles[side];

  return (
    <section
      aria-label={label}
      className={cn(
        "relative flex min-w-0 flex-col bg-paper text-paper-ink",
        style.page,
        className,
      )}
    >
      {style.edge && (
        <div
          aria-hidden
          className={cn(
            "absolute inset-y-0.5 w-1.25 rounded-[2px]",
            style.edge,
          )}
        />
      )}
      <div
        ref={scrollRef}
        className={cn(
          "relative min-h-0 flex-1 overflow-y-auto overscroll-contain",
          ruledLines,
          style.scroll,
        )}
      >
        {children}
        {measure && (
          <div
            aria-hidden
            inert
            className={cn(
              "invisible absolute top-0 h-0 overflow-hidden",
              style.measure,
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
            style.footer,
          )}
        >
          {footer}
        </div>
      )}
    </section>
  );
}
