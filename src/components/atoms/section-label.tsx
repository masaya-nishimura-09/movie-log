import type { ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-bold text-muted-foreground text-xs tracking-[0.08em] 2xl:text-sm">
      {children}
    </h2>
  );
}
