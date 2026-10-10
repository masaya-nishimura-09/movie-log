import type { ReactNode } from "react";

export function MoodTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-field px-3 py-1.5 text-foreground-sub text-xs leading-none">
      {children}
    </span>
  );
}
