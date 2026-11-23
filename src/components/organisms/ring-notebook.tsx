import type { ReactNode } from "react";
import { cn } from "@/lib/style/cn";
import { ruledLines } from "@/lib/style/paper";

type RingNotebookProps = {
  variant: "spread" | "single" | "responsive";
  mirrored?: boolean;
  plain?: boolean;
  children: ReactNode;
  className?: string;
};

function SingleCover({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 bg-cover shadow-[inset_0_1px_0_rgb(255_255_255/0.12),inset_0_-2px_0_rgb(0_0_0/0.15)]",
          mirrored
            ? "right-0 left-2 rounded-l-[14px]"
            : "right-2 left-0 rounded-r-[14px]",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 overflow-hidden",
          mirrored ? "right-0 left-2 -scale-x-100" : "right-2 left-0",
        )}
      >
        <svg
          aria-hidden="true"
          fill="none"
          className="absolute top-0 -left-10 h-full w-[calc(100%+40px)]"
        >
          <rect
            x="6"
            y="5.5"
            rx="9"
            className="h-[calc(100%-12px)] w-[calc(100%-12px)]"
            stroke="#d9b48a"
            strokeOpacity="0.6"
            strokeWidth="1.5"
            strokeDasharray="5 4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </>
  );
}

function NeighborPage({
  mirrored = false,
  plain = false,
}: {
  mirrored?: boolean;
  plain?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "paper-theme absolute top-3.5 bottom-3.5 z-2 w-3 bg-paper",
        !mirrored && !plain && ruledLines,
        mirrored ? "right-0" : "left-0",
      )}
    />
  );
}

const gutterShade =
  "pointer-events-none absolute z-10 w-6 from-[rgb(58_39_24/0.28)] to-transparent";

function SingleGutter({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        gutterShade,
        "top-3.5 bottom-3.5",
        mirrored
          ? "right-3 w-px bg-[rgb(58_39_24/0.3)] from-transparent"
          : "left-3 bg-linear-to-r shadow-[inset_1px_0_0_rgb(58_39_24/0.25)]",
      )}
    />
  );
}

function SpreadCover() {
  return (
    <>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full rounded-[14px] opacity-18 mix-blend-multiply"
      >
        <filter id="notebook-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix values="0 0 0 0 0.2 0 0 0 0 0.12 0 0 0 0 0.06 0 0 0 0.9 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#notebook-grain)" />
      </svg>
      <svg
        aria-hidden="true"
        fill="none"
        className="pointer-events-none absolute inset-0 size-full"
      >
        <rect
          x="7.5"
          y="6.5"
          rx="9"
          className="h-[calc(100%-15px)] w-[calc(100%-15px)]"
          stroke="rgb(0 0 0 / 0.2)"
          strokeWidth="1"
        />
        <rect
          x="7"
          y="6"
          rx="9"
          className="h-[calc(100%-15px)] w-[calc(100%-15px)]"
          stroke="rgb(255 255 255 / 0.1)"
          strokeWidth="1"
        />
        <rect
          x="7"
          y="6.5"
          rx="9"
          className="h-[calc(100%-14px)] w-[calc(100%-14px)]"
          stroke="#d9b48a"
          strokeOpacity="0.6"
          strokeWidth="1.6"
          strokeDasharray="5 4"
          strokeLinecap="round"
        />
      </svg>
    </>
  );
}

function SpreadGutter() {
  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          gutterShade,
          "top-3.5 bottom-4 left-[calc(50%-24px)] bg-linear-to-l",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          gutterShade,
          "top-3.5 bottom-4 left-1/2 bg-linear-to-r shadow-[inset_1px_0_0_rgb(58_39_24/0.3)]",
        )}
      />
    </>
  );
}

const singleFrame =
  "relative -mr-2 -ml-4 pt-3.5 pr-5 pb-3.5 pl-3 drop-shadow-[0_12px_18px_rgb(10_41_71/0.14)]";
const spreadFrame =
  "relative isolate flex rounded-[14px] bg-cover px-5 pt-3.5 pb-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.12),inset_0_-2px_0_rgb(0_0_0/0.15),0_24px_48px_rgb(10_41_71/0.16)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),inset_0_-2px_0_rgb(0_0_0/0.15),0_24px_48px_rgb(0_0_0/0.35)]";

export function RingNotebook({
  variant,
  mirrored = false,
  plain = false,
  children,
  className,
}: RingNotebookProps) {
  if (variant === "single") {
    return (
      <div className={cn(singleFrame, className)}>
        <SingleCover />
        <NeighborPage />
        {children}
        <SingleGutter />
      </div>
    );
  }

  if (variant === "spread") {
    return (
      <div className={cn(spreadFrame, className)}>
        <SpreadCover />
        {children}
        <SpreadGutter />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative isolate h-full max-lg:pt-3.5 max-lg:pb-3.5 max-lg:drop-shadow-[0_12px_18px_rgb(10_41_71/0.14)] lg:flex lg:h-auto lg:rounded-[14px] lg:bg-cover lg:px-5 lg:pt-3.5 lg:pb-4 lg:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),inset_0_-2px_0_rgb(0_0_0/0.15),0_24px_48px_rgb(10_41_71/0.16)] lg:dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),inset_0_-2px_0_rgb(0_0_0/0.15),0_24px_48px_rgb(0_0_0/0.35)]",
        mirrored
          ? "max-lg:-mr-4 max-lg:-ml-2 max-lg:pr-3 max-lg:pl-5"
          : "max-lg:-mr-2 max-lg:-ml-4 max-lg:pr-5 max-lg:pl-3",
        className,
      )}
    >
      <div className="contents lg:hidden">
        <SingleCover mirrored={mirrored} />
      </div>
      <div className="hidden lg:contents">
        <SpreadCover />
      </div>
      <div className="contents lg:hidden">
        <NeighborPage mirrored={mirrored} plain={plain} />
      </div>
      {children}
      <div className="contents lg:hidden">
        <SingleGutter mirrored={mirrored} />
      </div>
      <div className="hidden lg:contents">
        <SpreadGutter />
      </div>
    </div>
  );
}
