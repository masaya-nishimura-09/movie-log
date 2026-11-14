"use client";

import { Dialog } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import type { KeyboardEvent, ReactNode, RefObject } from "react";

export const imageDialogButton =
  "grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-background outline-none transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-background/70 disabled:pointer-events-none disabled:opacity-30";

type ImageDialogProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  closeLabel: string;
  closeDisabled?: boolean;
  actions?: ReactNode;
  onKeyDown?: (event: KeyboardEvent) => void;
  finalFocus?: RefObject<HTMLElement | null>;
  children: ReactNode;
};

export function ImageDialog({
  open,
  onClose,
  title,
  closeLabel,
  closeDisabled = false,
  actions,
  onKeyDown,
  finalFocus,
  children,
}: ImageDialogProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-[color-mix(in_oklab,var(--navy)_94%,transparent)] transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-sm" />
        <Dialog.Popup
          onKeyDown={onKeyDown}
          finalFocus={finalFocus}
          className="fixed inset-0 z-50 flex flex-col outline-none transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
            <Dialog.Title className="min-w-0 font-medium text-background/80 text-sm tabular-nums">
              {title}
            </Dialog.Title>
            <div className="flex items-center gap-2">
              {actions}
              <Dialog.Close
                className={imageDialogButton}
                disabled={closeDisabled}
              >
                <XIcon className="size-5" aria-hidden />
                <span className="sr-only">{closeLabel}</span>
              </Dialog.Close>
            </div>
          </div>
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
