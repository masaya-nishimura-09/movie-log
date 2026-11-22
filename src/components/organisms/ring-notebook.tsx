import type { ReactNode } from "react";
import { BinderMechanism } from "@/components/atoms/binder-mechanism";
import { cn } from "@/lib/style/cn";

type RingNotebookProps = {
  variant: "spread" | "single" | "responsive";
  mirrored?: boolean;
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
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 w-9 bg-black/10",
          mirrored ? "right-1.5" : "left-1.5",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "paper-theme absolute top-2.5 bottom-3 w-1.5 bg-paper",
          mirrored
            ? "right-0 shadow-[inset_3px_0_4px_rgb(0_0_0/0.08)]"
            : "left-0 shadow-[inset_-3px_0_4px_rgb(0_0_0/0.08)]",
        )}
      />
    </>
  );
}

function SingleBinder({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <BinderMechanism
      left={mirrored ? "cover" : "page"}
      className={cn("inset-y-0.5", mirrored ? "-right-4.75" : "-left-4.75")}
      ringsClassName="top-17"
      bottomRingsClassName="bottom-17"
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
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-[calc(50%-18px)] w-9 bg-black/10 shadow-[inset_1px_0_0_rgb(0_0_0/0.12),inset_-1px_0_0_rgb(0_0_0/0.12)]"
      />
    </>
  );
}

function SpreadBinder({ insideCover = false }: { insideCover?: boolean }) {
  return (
    <BinderMechanism
      left={insideCover ? "cover" : "page"}
      className="inset-y-0.5 left-[calc(50%-43px)]"
      ringsClassName="top-23"
      bottomRingsClassName="bottom-23"
    />
  );
}

const singleFrame =
  "relative -mr-2 -ml-4 pt-2.5 pr-5 pb-3 pl-10.5 drop-shadow-[0_12px_18px_rgb(10_41_71/0.14)]";
const spreadFrame =
  "relative flex gap-9 rounded-[14px] bg-cover px-5 pt-3.5 pb-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.12),inset_0_-2px_0_rgb(0_0_0/0.15),0_24px_48px_rgb(10_41_71/0.16)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),inset_0_-2px_0_rgb(0_0_0/0.15),0_24px_48px_rgb(0_0_0/0.35)]";

export function RingNotebook({
  variant,
  mirrored = false,
  children,
  className,
}: RingNotebookProps) {
  if (variant === "single") {
    return (
      <div className={cn(singleFrame, className)}>
        <SingleCover />
        {children}
        <SingleBinder />
      </div>
    );
  }

  if (variant === "spread") {
    return (
      <div className={cn(spreadFrame, className)}>
        <SpreadCover />
        {children}
        <SpreadBinder />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-full max-lg:pt-2.5 max-lg:pb-3 max-lg:drop-shadow-[0_12px_18px_rgb(10_41_71/0.14)] lg:flex lg:h-auto lg:gap-9 lg:rounded-[14px] lg:bg-cover lg:px-5 lg:pt-3.5 lg:pb-4 lg:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),inset_0_-2px_0_rgb(0_0_0/0.15),0_24px_48px_rgb(10_41_71/0.16)] lg:dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),inset_0_-2px_0_rgb(0_0_0/0.15),0_24px_48px_rgb(0_0_0/0.35)]",
        mirrored
          ? "max-lg:-mr-4 max-lg:-ml-2 max-lg:pr-10.5 max-lg:pl-5"
          : "max-lg:-mr-2 max-lg:-ml-4 max-lg:pr-5 max-lg:pl-10.5",
        className,
      )}
    >
      <div className="contents lg:hidden">
        <SingleCover mirrored={mirrored} />
      </div>
      <div className="hidden lg:contents">
        <SpreadCover />
      </div>
      {children}
      <div className="contents lg:hidden">
        <SingleBinder mirrored={mirrored} />
      </div>
      <div className="hidden lg:contents">
        <SpreadBinder insideCover={mirrored} />
      </div>
    </div>
  );
}
