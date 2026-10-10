import type { ReactNode } from "react";

export function GenreTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-field px-2.75 py-1.25 text-foreground-sub text-xs leading-none">
      {children}
    </span>
  );
}
