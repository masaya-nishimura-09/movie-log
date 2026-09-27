import type { ReactNode } from "react";

export function MoodTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-mood px-3 py-1.5 text-mood-foreground text-xs leading-none">
      {children}
    </span>
  );
}
