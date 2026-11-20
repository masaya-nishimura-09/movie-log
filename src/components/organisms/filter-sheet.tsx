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
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";

type FilterSheetProps = {
  activeCount: number;
  resultCount: number;
  clearHref: string;
  closeLabel: string;
  dict: Pick<
    Dictionary["recordFilter"],
    "open" | "title" | "clearAll" | "showResults"
  >;
  children: ReactNode;
};

export function FilterSheet({
  activeCount,
  resultCount,
  clearHref,
  closeLabel,
  dict,
  children,
}: FilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger
        aria-label={dict.open}
        className={cn(
          buttonVariants({ variant: "secondary", size: "sm" }),
          "h-9 px-3 text-[13px] text-foreground",
          activeCount > 0 &&
            "bg-foreground text-background hover:bg-foreground",
        )}
      >
        <SlidersHorizontal className="size-3.75" aria-hidden />
        {dict.open}
        {activeCount > 0 && <span className="tabular-nums">{activeCount}</span>}
      </SheetTrigger>
      <SheetContent
        side="bottom"
        closeLabel={closeLabel}
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
        <div className="overflow-y-auto px-4 pb-6">{children}</div>
        <SheetFooter className="border-t">
          <SheetClose render={<Button className="w-full" />}>
            {interpolate(dict.showResults, { count: resultCount })}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
