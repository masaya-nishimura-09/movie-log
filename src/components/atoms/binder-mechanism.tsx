import { cn } from "@/lib/style/cn";

type Side = "page" | "cover";

function Ring({ left, right }: { left: Side; right: Side }) {
  const from = 18;
  const to = 94;
  return (
    <svg
      aria-hidden="true"
      width="78"
      height="28"
      viewBox="0 0 112 40"
      fill="none"
      strokeLinecap="round"
      className="block"
    >
      {left === "page" && (
        <circle
          cx="18"
          cy="20"
          r="6"
          fill="#8b5e3c"
          stroke="#6b4630"
          strokeWidth="1"
        />
      )}
      {right === "page" && (
        <circle
          cx="94"
          cy="20"
          r="6"
          fill="#8b5e3c"
          stroke="#6b4630"
          strokeWidth="1"
        />
      )}
      <path
        d={`M${from} 20 H${to}`}
        stroke="#5a3d28"
        strokeWidth="7"
        transform="translate(0,2)"
      />
      <path d={`M${from} 20 H${to}`} stroke="#c9a46a" strokeWidth="7" />
      <path
        d={`M${from + 6} 18 H${to - 6}`}
        stroke="#f1dcb4"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function RingGroup({
  left,
  right,
  className,
}: {
  left: Side;
  right: Side;
  className: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-x-0 flex flex-col items-center gap-2.5",
        className,
      )}
    >
      <Ring left={left} right={right} />
      <Ring left={left} right={right} />
      <Ring left={left} right={right} />
    </div>
  );
}

const rivet =
  "absolute left-2 size-3 rounded-full bg-[radial-gradient(circle_at_40%_35%,#fbf0d6,#d4b277_45%,#a07c46_75%,#8b6a3a)] shadow-[0_1px_1px_rgb(58_39_24/0.35),inset_0_0_0_0.6px_rgb(90_61_40/0.4)]";
const pin =
  "absolute left-2.5 size-1.75 rounded-full bg-[radial-gradient(circle_at_40%_35%,#f6e6c4,#c9a46a_55%,#a07c46)]";
const cap =
  "absolute left-6 h-3.25 w-9.5 rounded-[7px_7px_4px_4px] bg-[linear-gradient(to_bottom,#f6e6c4,#c9a46a_55%,#8b6a3a)] shadow-[0_2px_3px_rgb(58_39_24/0.4),inset_0_0_0_0.8px_rgb(90_61_40/0.45)]";

export function BinderMechanism({
  left = "page",
  right = "page",
  ringsClassName = "top-19",
  bottomRingsClassName = "bottom-19",
  className,
}: {
  left?: Side;
  right?: Side;
  ringsClassName?: string;
  bottomRingsClassName?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute z-10 w-21.5", className)}
    >
      <div className="absolute inset-y-3 left-7.25 w-7 rounded-[3px] bg-[linear-gradient(to_right,#7d5a2c,#e9cf98_12%,#f6e6c4_20%,#b08b52_30%,#c9a46a_50%,#b08b52_70%,#f0dcae_82%,#d4b277_90%,#7d5a2c)] shadow-[0_2px_4px_rgb(58_39_24/0.35)]">
        <span className="absolute inset-x-2 inset-y-1 bg-[linear-gradient(to_right,#a07c46,#c4a066_50%,#a07c46)] shadow-[inset_1px_0_1px_rgb(58_39_24/0.35),inset_-1px_0_1px_rgb(58_39_24/0.35)]" />
        <span className={cn(rivet, "top-3.5")} />
        <span className={cn(rivet, "bottom-3.5")} />
        <span className={cn(pin, "top-[calc(50%-30px)]")} />
        <span className={cn(pin, "top-[calc(50%+22px)]")} />
      </div>
      <span className={cn(cap, "top-1")} />
      <span className={cn(cap, "bottom-1 -scale-y-100")} />
      <RingGroup left={left} right={right} className={ringsClassName} />
      <RingGroup left={left} right={right} className={bottomRingsClassName} />
    </div>
  );
}
