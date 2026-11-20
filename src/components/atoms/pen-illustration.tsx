import { cn } from "@/lib/style/cn";

export function PenIllustration({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width="150"
      height="26"
      viewBox="0 0 230 40"
      className={cn(
        "block -rotate-8 drop-shadow-[0_4px_4px_rgb(10_41_71/0.16)]",
        className,
      )}
    >
      <path d="M8 20 L34 14 L34 26 Z" fill="#c9a46a" />
      <path d="M8 20 L20 17.3 L20 22.7 Z" fill="#5a3d28" />
      <rect x="34" y="12" width="26" height="16" rx="2" fill="#2a3a4c" />
      <rect x="60" y="11" width="112" height="18" rx="4" fill="#0a2947" />
      <rect x="66" y="13" width="100" height="3" rx="1.5" fill="#33506c" />
      <rect x="172" y="10" width="50" height="20" rx="6" fill="#0a2947" />
      <rect x="160" y="9" width="6" height="22" rx="1" fill="#c9a46a" />
      <path
        d="M178 8 H214 a3 3 0 0 1 0 6 H184"
        fill="none"
        stroke="#c9a46a"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
