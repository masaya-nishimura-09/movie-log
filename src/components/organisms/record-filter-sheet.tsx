import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button, buttonVariants } from "@/components/atoms/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/molecules/sheet";
import type { Dictionary } from "@/i18n/get-dictionary";
import { interpolate } from "@/lib/text/interpolate";

type RecordFilterSheetProps = {
  activeCount: number;
  resultCount: number;
  clearHref: string;
  dict: Dictionary["recordFilter"];
  children: ReactNode;
};

export function RecordFilterSheet({
  activeCount,
  resultCount,
  clearHref,
  dict,
  children,
}: RecordFilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger
        aria-label={dict.open}
        className="flex h-9 items-center gap-1.5 rounded-full border-[1.5px] border-selected-border bg-card px-3 font-bold text-accent-foreground text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <SlidersHorizontal className="size-4" aria-hidden />
        {activeCount > 0 && activeCount}
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="max-h-[85dvh] rounded-t-[20px] bg-card"
      >
        <SheetHeader className="flex-row items-center justify-between border-b pr-12">
          <SheetTitle>{dict.title}</SheetTitle>
          <Link
            href={clearHref}
            scroll={false}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            {dict.clearAll}
          </Link>
        </SheetHeader>
        <div className="overflow-y-auto px-4">{children}</div>
        <SheetFooter className="border-t">
          <SheetClose render={<Button className="w-full" />}>
            {interpolate(dict.showResults, { count: resultCount })}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
