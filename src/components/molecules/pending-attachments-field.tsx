"use client";

import { Plus, X } from "lucide-react";
import Image from "next/image";
import { type DragEvent, useEffect, useMemo, useState } from "react";
import { MaskingTape } from "@/components/atoms/masking-tape";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";
import { posterContentTypes, posterMaxBytes } from "@/schemas/media/media";
import { type Attachment, maxAttachments } from "@/schemas/record/attachment";

type PendingAttachmentsFieldProps = {
  files: File[];
  onChange: (files: File[]) => void;
  existing?: Attachment[];
  onExistingChange?: (existing: Attachment[]) => void;
  dict: {
    attachmentsAdd: string;
    attachmentsDrop: string;
    attachmentRemove: string;
    attachmentsInvalid: string;
    attachmentsLimit: string;
  };
};

function isAttachable(file: File): boolean {
  return (
    file.size > 0 &&
    file.size <= posterMaxBytes &&
    posterContentTypes.includes(file.type)
  );
}

function RemoveButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="absolute -top-1.75 -right-1.75 grid size-5.5 place-items-center rounded-full bg-(--navy) text-(--beige) outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <X className="size-2.75" strokeWidth={2.6} aria-hidden />
    </button>
  );
}

const frameClass =
  "relative bg-white p-1.5 shadow-[0_5px_12px_rgb(10_41_71/0.15)] lg:p-1.75 lg:shadow-[0_6px_14px_rgb(10_41_71/0.16)]";
const photoClass = "relative block aspect-5/7 overflow-hidden";

export function PendingAttachmentsField({
  files,
  onChange,
  existing = [],
  onExistingChange,
  dict,
}: PendingAttachmentsFieldProps) {
  const [error, setError] = useState<string>();
  const [dragging, setDragging] = useState(false);
  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );
  const total = existing.length + files.length;

  useEffect(
    () => () => {
      for (const url of previews) URL.revokeObjectURL(url);
    },
    [previews],
  );

  const addFiles = (picked: File[]) => {
    const valid = picked.filter(isAttachable);
    const room = maxAttachments - total;
    onChange([...files, ...valid.slice(0, room)]);
    setError(
      valid.length > room
        ? interpolate(dict.attachmentsLimit, { max: maxAttachments })
        : valid.length < picked.length
          ? dict.attachmentsInvalid
          : undefined,
    );
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    addFiles([...event.dataTransfer.files]);
  };

  return (
    <div className="flex flex-col gap-2">
      <ul className="grid grid-cols-3 gap-x-3 gap-y-5 pt-1.5 lg:gap-x-5 lg:gap-y-6">
        {existing.map((attachment, index) => (
          <li key={attachment.attachmentId} className={frameClass}>
            <span className={photoClass}>
              <Image
                src={attachment.imageUrl}
                alt=""
                fill
                unoptimized
                sizes="140px"
                className="object-cover"
              />
            </span>
            <RemoveButton
              label={interpolate(dict.attachmentRemove, { number: index + 1 })}
              onClick={() => {
                onExistingChange?.(
                  existing.filter(
                    (a) => a.attachmentId !== attachment.attachmentId,
                  ),
                );
                setError(undefined);
              }}
            />
          </li>
        ))}
        {previews.map((preview, index) => (
          <li key={preview} className={frameClass}>
            <span className={photoClass}>
              {/* biome-ignore lint/performance/noImgElement: object URLs of local files cannot go through next/image */}
              <img src={preview} alt="" className="size-full object-cover" />
            </span>
            <RemoveButton
              label={interpolate(dict.attachmentRemove, {
                number: existing.length + index + 1,
              })}
              onClick={() => {
                onChange(files.filter((_, i) => i !== index));
                setError(undefined);
              }}
            />
          </li>
        ))}
        {total < maxAttachments && (
          <li className={frameClass}>
            <label
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={cn(
                photoClass,
                "flex cursor-pointer flex-col items-center justify-center gap-1 border border-dashed text-center has-focus-visible:ring-2 has-focus-visible:ring-ring",
                dragging
                  ? "border-primary bg-[rgb(139_94_60/0.06)]"
                  : "border-[rgb(10_41_71/0.3)]",
              )}
            >
              <span className="grid size-6.5 place-items-center rounded-full bg-[rgb(139_94_60/0.12)] text-primary lg:size-8">
                <Plus className="size-3.5 lg:size-4" aria-hidden />
              </span>
              <span className="font-bold text-paper-label text-xs">
                {dict.attachmentsAdd}
              </span>
              <span className="hidden text-paper-muted text-xs lg:block">
                {dict.attachmentsDrop}
              </span>
              <input
                type="file"
                accept={posterContentTypes.join(",")}
                multiple
                className="sr-only"
                onChange={(event) => {
                  addFiles([...(event.target.files ?? [])]);
                  event.target.value = "";
                }}
              />
            </label>
            <MaskingTape className="h-4 w-12.5 lg:h-5.5 lg:w-16" />
          </li>
        )}
      </ul>
      {error && (
        <p
          role="alert"
          className="text-destructive-foreground text-xs leading-7"
        >
          {error}
        </p>
      )}
    </div>
  );
}
