"use client";

import { useId } from "react";
import { BrandShape } from "@/components/atoms/brand-shape";
import { wordmarkShapes } from "@/components/atoms/logo-shapes";
import { PenIllustration } from "@/components/atoms/pen-illustration";
import { cn } from "@/lib/style/cn";

const bottleBody =
  "M50 44 Q50 38 58 37 H110 Q118 38 118 44 V88 Q118 96 110 96 H58 Q50 96 50 88 Z";

function InkBottle() {
  const id = useId();
  const glass = `${id}-glass`;
  const tint = `${id}-tint`;

  return (
    <div className="relative w-30">
      <svg
        aria-hidden="true"
        viewBox="0 0 130 100"
        className="block w-full drop-shadow-[0_4px_4px_rgb(10_41_71/0.16)]"
      >
        <defs>
          <clipPath id={glass}>
            <path d={bottleBody} />
          </clipPath>
          <linearGradient id={tint} x1="0" x2="1">
            <stop offset="0" stopColor="#2c4f86" stopOpacity="0.35" />
            <stop offset="0.5" stopColor="#2c4f86" stopOpacity="0.15" />
            <stop offset="1" stopColor="#2c4f86" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <ellipse cx="84" cy="97" rx="36" ry="3" fill="#0a2947" opacity="0.12" />
        <ellipse cx="22" cy="96" rx="15" ry="3" fill="#0a2947" opacity="0.12" />
        <rect x="8" y="70" width="28" height="26" rx="3" fill="#0f2f55" />
        <path
          d="M12 72 V94 M17 72 V94 M22 72 V94 M27 72 V94 M32 72 V94"
          stroke="#fff"
          strokeOpacity="0.18"
          strokeWidth="1.2"
        />
        <rect x="8" y="70" width="28" height="4" rx="2" fill="#1d4677" />
        <path d="M74 38 V26 H94 V38 Z" fill={`url(#${tint})`} />
        <g
          fill="#2c4f86"
          fillOpacity="0.28"
          stroke="#1d3f66"
          strokeOpacity="0.5"
          strokeWidth="1"
        >
          <rect x="72" y="27.5" width="24" height="4" rx="2" />
          <rect x="72" y="32.5" width="24" height="4" rx="2" />
        </g>
        <path
          d="M74 26 V38 M94 26 V38"
          stroke="#1d3f66"
          strokeOpacity="0.5"
          strokeWidth="1"
        />
        <rect
          x="74.5"
          y="21"
          width="19"
          height="5"
          rx="1.5"
          fill="#2c4f86"
          fillOpacity="0.3"
          stroke="#1d3f66"
          strokeOpacity="0.6"
          strokeWidth="1.2"
        />
        <path d={bottleBody} fill={`url(#${tint})`} />
        <g clipPath={`url(#${glass})`}>
          <rect
            x="40"
            y="37"
            width="90"
            height="60"
            fill="#14305a"
            className="origin-bottom animate-ink-use [transform-box:fill-box] motion-reduce:animate-none"
          />
        </g>
        <path
          d={bottleBody}
          fill="none"
          stroke="#1d3f66"
          strokeOpacity="0.55"
          strokeWidth="1.4"
        />
        <path
          d="M55 46 V86"
          stroke="#fff"
          strokeOpacity="0.55"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect
          x="58"
          y="56"
          width="52"
          height="28"
          rx="1.5"
          fill="#f7f2e8"
          stroke="#0a2947"
          strokeOpacity="0.25"
        />
        <rect
          x="61"
          y="59"
          width="46"
          height="22"
          fill="none"
          stroke="#0a2947"
          strokeOpacity="0.2"
          strokeWidth="0.6"
        />
      </svg>
      <BrandShape
        shapes={wordmarkShapes}
        ringClassName="fill-[#b98a63]"
        glyphClassName="fill-[#0a2947]"
        className="absolute top-[61%] left-[47.7%] h-[18%] w-[33.8%]"
      />
    </div>
  );
}

export function InkLoading({ className }: { className?: string }) {
  return (
    <output
      aria-busy
      className={cn(
        "flex flex-col items-center gap-7 text-paper-ink",
        className,
      )}
    >
      <InkBottle />
      <span className="relative block h-17.5 w-42.5">
        <span className="absolute inset-0 flex animate-ink-write items-center whitespace-nowrap font-hand text-[52px] motion-reduce:animate-none">
          Loading...
        </span>
        <span
          aria-hidden
          className="absolute top-0 left-0 animate-ink-pen motion-reduce:hidden"
        >
          <PenIllustration className="h-auto w-30 origin-[4px_13px] rotate-[-35deg]" />
        </span>
      </span>
    </output>
  );
}
