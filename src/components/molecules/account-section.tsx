import type { ReactNode } from "react";
import { phrases } from "@/components/atoms/phrases";
import { cn } from "@/lib/style/cn";

type AccountSectionProps = {
  title: string;
  description: string;
  danger?: boolean;
  children: ReactNode;
};

export function AccountSection({
  title,
  description,
  danger = false,
  children,
}: AccountSectionProps) {
  return (
    <section className="grid gap-x-10 gap-y-4 border-t py-7 md:grid-cols-[minmax(0,16.25rem)_minmax(0,1fr)]">
      <div>
        <h2
          className={cn(
            "font-bold font-display text-base leading-7",
            danger ? "text-destructive-foreground" : "text-foreground",
          )}
        >
          {title}
        </h2>
        <p className="mt-0.5 text-muted-foreground text-xs leading-5">
          {phrases(description)}
        </p>
      </div>
      <div className="min-w-0 max-w-115">{children}</div>
    </section>
  );
}
