import type { ReactNode } from "react";

export function GenreTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-genre px-2.75 py-1.25 text-genre-foreground text-xs leading-none">
      {children}
    </span>
  );
}
