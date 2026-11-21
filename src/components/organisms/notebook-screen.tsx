import type { PointerEventHandler, ReactNode } from "react";
import { cn } from "@/lib/style/cn";

type NotebookScreenProps = {
  toolbar: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  grow?: boolean;
  onPointerDown?: PointerEventHandler;
  onPointerUp?: PointerEventHandler;
};

export function NotebookScreen({
  toolbar,
  children,
  footer,
  grow = false,
  onPointerDown,
  onPointerUp,
}: NotebookScreenProps) {
  return (
    <div
      className={cn(
        "app-container flex flex-col lg:pb-6",
        grow
          ? "max-lg:grid max-lg:min-h-[calc(100svh-var(--app-header-height)-env(safe-area-inset-bottom))] max-lg:grid-rows-[auto_1fr_auto]"
          : "max-lg:h-[calc(100svh-var(--app-header-height)-env(safe-area-inset-bottom))]",
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5 pt-1.5 pb-2.5 lg:gap-3 lg:py-4">
        {toolbar}
      </div>
      <div
        className={cn(
          "flex-1 touch-pan-y lg:flex-none",
          grow ? "[&_[data-slot=page-body]]:overscroll-auto" : "min-h-0",
        )}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {children}
      </div>
      {footer}
    </div>
  );
}
