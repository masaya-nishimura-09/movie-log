"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/molecules/sheet";
import { AppNav, type AppNavProps } from "@/components/organisms/app-nav";

type AppNavDrawerProps = AppNavProps & {
  openLabel: string;
  className?: string;
};

export function AppNavDrawer({
  openLabel,
  className,
  ...props
}: AppNavDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger aria-label={openLabel} className={className}>
        <Menu className="size-5" aria-hidden />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="shell w-72 rounded-r-2xl bg-sidebar px-4 pt-14 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
      >
        <SheetTitle className="sr-only">{props.dict.label}</SheetTitle>
        <AppNav
          {...props}
          layout="full"
          className="flex-1"
          onNavigate={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
