"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ChevronLeft, ChevronRight, XIcon } from "lucide-react";
import Image from "next/image";
import { type KeyboardEvent, type PointerEvent, useRef } from "react";
import type { ActionResult } from "@/actions/action-result";
import { DeleteDialog } from "@/components/organisms/delete-dialog";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";
import type { Attachment } from "@/schemas/record/attachment";

type AttachmentViewerProps = {
  attachments: Attachment[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  remove?: (attachmentId: string) => Promise<ActionResult<null>>;
  dict: Dictionary["recordDetail"];
  deleteDict: Dictionary["deleteAttachment"];
};

const swipeDistance = 50;

const roundButton =
  "grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-background outline-none transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-background/70 disabled:pointer-events-none disabled:opacity-30";

export function AttachmentViewer({
  attachments,
  index,
  onIndexChange,
  onClose,
  remove,
  dict,
  deleteDict,
}: AttachmentViewerProps) {
  const opened = attachments[index];
  const hasPrev = index > 0;
  const hasNext = index < attachments.length - 1;
  const swipeStart = useRef<number>(undefined);

  const move = (step: number) => {
    const next = index + step;
    if (next >= 0 && next < attachments.length) onIndexChange(next);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") swipeStart.current = event.clientX;
  };

  const onPointerUp = (event: PointerEvent) => {
    if (swipeStart.current === undefined) return;
    const distance = event.clientX - swipeStart.current;
    swipeStart.current = undefined;
    if (distance > swipeDistance) move(-1);
    if (distance < -swipeDistance) move(1);
  };

  return (
    <Dialog.Root
      open={opened !== undefined}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-[color-mix(in_oklab,var(--navy)_94%,transparent)] transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-sm" />
        <Dialog.Popup
          onKeyDown={onKeyDown}
          className="fixed inset-0 z-50 flex flex-col outline-none transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0"
        >
          {opened && (
            <>
              <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
                <Dialog.Title className="font-medium text-background/80 text-sm tabular-nums">
                  {interpolate(dict.attachmentPosition, {
                    number: index + 1,
                    total: attachments.length,
                  })}
                </Dialog.Title>
                <div className="flex items-center gap-2">
                  {remove && (
                    <DeleteDialog
                      action={() => remove(opened.attachmentId)}
                      description={deleteDict.description}
                      triggerLabel={dict.attachmentDelete}
                      triggerClassName={cn(roundButton, "h-10 p-0 shadow-none")}
                      iconOnly
                      dict={deleteDict}
                    />
                  )}
                  <Dialog.Close className={roundButton}>
                    <XIcon className="size-5" aria-hidden />
                    <span className="sr-only">{dict.attachmentClose}</span>
                  </Dialog.Close>
                </div>
              </div>

              <div
                className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 md:px-24 md:pb-12"
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
              >
                <Image
                  key={opened.attachmentId}
                  src={opened.imageUrl}
                  alt=""
                  width={1600}
                  height={2263}
                  unoptimized
                  sizes="100vw"
                  draggable={false}
                  className="h-auto max-h-full w-auto max-w-full select-none rounded-lg object-contain shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)]"
                />
              </div>
              {attachments.length > 1 && (
                <div className="flex justify-center gap-6 pb-6 md:contents">
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    disabled={!hasPrev}
                    aria-label={dict.attachmentPrev}
                    className={cn(
                      roundButton,
                      "md:fixed md:top-1/2 md:left-6 md:size-12 md:-translate-y-1/2",
                    )}
                  >
                    <ChevronLeft className="size-6" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(1)}
                    disabled={!hasNext}
                    aria-label={dict.attachmentNext}
                    className={cn(
                      roundButton,
                      "md:fixed md:top-1/2 md:right-6 md:size-12 md:-translate-y-1/2",
                    )}
                  >
                    <ChevronRight className="size-6" aria-hidden />
                  </button>
                </div>
              )}
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
