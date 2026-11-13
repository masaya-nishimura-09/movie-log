"use client";

import { Plus, XIcon } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { MaskingTape } from "@/components/atoms/masking-tape";
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
      className="absolute top-3.5 right-1.5 grid size-7 place-items-center rounded-full bg-foreground/70 text-background outline-none transition-colors hover:bg-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <XIcon className="size-4" aria-hidden />
    </button>
  );
}

const thumbnailClass =
  "relative block aspect-[210/297] overflow-hidden rounded-[2px] bg-background shadow-[0_6px_12px_-8px_rgb(10_41_71/0.55)]";
const tapeClass =
  "top-0 h-3.5 w-10 in-[li:nth-child(3n)]:rotate-2 in-[li:nth-child(3n+2)]:-rotate-1";

export function PendingAttachmentsField({
  files,
  onChange,
  existing = [],
  onExistingChange,
  dict,
}: PendingAttachmentsFieldProps) {
  const [error, setError] = useState<string>();
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

  const onFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = [...(event.target.files ?? [])];
    event.target.value = "";
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

  return (
    <div className="flex flex-col gap-2">
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2.5">
        {existing.map((attachment, index) => (
          <li key={attachment.attachmentId} className="relative pt-2">
            <span className={thumbnailClass}>
              <Image
                src={attachment.imageUrl}
                alt=""
                fill
                unoptimized
                sizes="120px"
                className="object-cover"
              />
            </span>
            <MaskingTape className={tapeClass} />
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
          <li key={preview} className="relative pt-2">
            <span className={thumbnailClass}>
              {/* biome-ignore lint/performance/noImgElement: object URLs of local files cannot go through next/image */}
              <img src={preview} alt="" className="size-full object-cover" />
            </span>
            <MaskingTape className={tapeClass} />
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
          <li className="pt-2">
            <label className="flex aspect-[210/297] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[2px] border border-dashed px-2 text-center text-muted-foreground text-xs outline-none transition-colors hover:text-foreground has-focus-visible:ring-2 has-focus-visible:ring-ring">
              <Plus className="size-4.5" aria-hidden />
              {dict.attachmentsAdd}
              <input
                type="file"
                accept={posterContentTypes.join(",")}
                multiple
                className="sr-only"
                onChange={onFiles}
              />
            </label>
          </li>
        )}
      </ul>
      {error && (
        <p role="alert" className="text-destructive-foreground text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
