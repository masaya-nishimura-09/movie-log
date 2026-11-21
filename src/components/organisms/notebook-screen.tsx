import type { PointerEventHandler, ReactNode } from "react";

type NotebookScreenProps = {
  toolbar: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onPointerDown?: PointerEventHandler;
  onPointerUp?: PointerEventHandler;
};

export function NotebookScreen({
  toolbar,
  children,
  footer,
  onPointerDown,
  onPointerUp,
}: NotebookScreenProps) {
  return (
    <div className="app-container flex flex-col max-lg:h-[calc(100svh-var(--app-header-height)-env(safe-area-inset-bottom))] lg:pb-6">
      <div className="flex flex-wrap items-center gap-1.5 pt-1.5 pb-2.5 lg:gap-3 lg:py-4">
        {toolbar}
      </div>
      <div
        className="min-h-0 flex-1 touch-pan-y lg:flex-none"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {children}
      </div>
      {footer}
    </div>
  );
}
