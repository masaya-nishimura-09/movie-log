"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { type KeyboardEvent, type PointerEvent, useRef } from "react";
import type { ActionResult } from "@/actions/action-result";
import { DeleteDialog } from "@/components/organisms/delete-dialog";
import {
  ImageDialog,
  imageDialogButton,
} from "@/components/organisms/image-dialog";
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
    <ImageDialog
      open={opened !== undefined}
      onClose={onClose}
      onKeyDown={onKeyDown}
      title={interpolate(dict.attachmentPosition, {
        number: index + 1,
        total: attachments.length,
      })}
      closeLabel={dict.attachmentClose}
      actions={
        remove &&
        opened && (
          <DeleteDialog
            action={() => remove(opened.attachmentId)}
            description={deleteDict.description}
            triggerLabel={dict.attachmentDelete}
            triggerClassName={cn(imageDialogButton, "h-10 p-0 shadow-none")}
            iconOnly
            dict={deleteDict}
          />
        )
      }
    >
      {opened && (
        <>
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
                  imageDialogButton,
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
                  imageDialogButton,
                  "md:fixed md:top-1/2 md:right-6 md:size-12 md:-translate-y-1/2",
                )}
              >
                <ChevronRight className="size-6" aria-hidden />
              </button>
            </div>
          )}
        </>
      )}
    </ImageDialog>
  );
}
