import type { ReactNode } from "react";

type FilterSectionProps = {
  title: string;
  children: ReactNode;
};

export function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <section className="flex flex-col gap-2.25">
      <h2 className="font-bold text-muted-foreground text-xs tracking-[0.08em]">
        {title}
      </h2>
      {children}
    </section>
  );
}
