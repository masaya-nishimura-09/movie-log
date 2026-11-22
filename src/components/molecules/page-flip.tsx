import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/style/cn";

type SpreadFlipProps = {
  dir: 1 | -1;
  front: ReactNode;
  back: ReactNode;
  onEnd: () => void;
};

type SingleFlipProps = {
  dir: 1 | -1;
  page: ReactNode;
  onEnd: () => void;
};

const spreadRingFromRight = "-10px 50%";
const spreadRingFromLeft = "calc(100% + 10px) 50%";
const singleRing = "-10px 50%";
const wrapDuration = 450;

const shade = "absolute inset-0 rounded-[3px] bg-[rgb(10_41_71)]";
const castFromLeft =
  "bg-[linear-gradient(to_right,rgb(10_41_71/0.28),transparent_55%)]";
const castFromRight =
  "bg-[linear-gradient(to_left,rgb(10_41_71/0.28),transparent_55%)]";

function SpreadFace({
  children,
  back = false,
}: {
  children: ReactNode;
  back?: boolean;
}) {
  return (
    <div
      className="absolute inset-0 [backface-visibility:hidden]"
      style={back ? { transform: "rotateY(180deg)" } : undefined}
    >
      {children}
      <div
        aria-hidden
        className={cn(
          shade,
          back ? "animate-flip-shade-back" : "animate-flip-shade",
        )}
      />
    </div>
  );
}

export function SpreadFlip({ dir, front, back, onEnd }: SpreadFlipProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-5 [perspective:1600px]">
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 animate-flip-cast",
          dir === 1 ? castFromLeft : castFromRight,
        )}
      />
      <div
        className={cn(
          "relative size-full [transform-style:preserve-3d]",
          dir === 1 ? "animate-flip-forward" : "animate-flip-back",
        )}
        style={{
          transformOrigin: dir === 1 ? spreadRingFromRight : spreadRingFromLeft,
        }}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) onEnd();
        }}
      >
        <SpreadFace>{front}</SpreadFace>
        <SpreadFace back>{back}</SpreadFace>
      </div>
    </div>
  );
}

function wrap(name: string, forward: boolean): CSSProperties {
  return {
    animationName: name,
    animationDuration: `${wrapDuration}ms`,
    animationTimingFunction: "cubic-bezier(0.4, 0, 0.7, 1)",
    animationDirection: forward ? "normal" : "reverse",
    animationFillMode: "both",
  };
}

export function SingleFlip({ dir, page, onEnd }: SingleFlipProps) {
  const forward = dir === 1;
  return (
    <div className="pointer-events-none absolute inset-0 z-5 [clip-path:inset(-50%_-50%_-50%_-50px)] [perspective:1600px]">
      <div
        aria-hidden
        className={cn("absolute inset-0", castFromLeft)}
        style={{ animation: `flip-cast ${wrapDuration}ms ease-in-out both` }}
      />
      <div
        className="relative size-full [transform-style:preserve-3d]"
        style={{ transformOrigin: singleRing, ...wrap("flip-wrap", forward) }}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) onEnd();
        }}
      >
        <div className="absolute inset-0 [backface-visibility:hidden]">
          {page}
          <div
            aria-hidden
            className={shade}
            style={wrap("flip-wrap-shade", forward)}
          />
        </div>
        <div
          className="absolute inset-0 [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="paper-theme absolute inset-0 rounded-[3px] bg-paper" />
          <div
            aria-hidden
            className={shade}
            style={wrap("flip-wrap-shade", forward)}
          />
        </div>
      </div>
    </div>
  );
}
