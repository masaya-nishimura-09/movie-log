"use client";

import { Plus, XIcon } from "lucide-react";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { interpolate } from "@/lib/text/interpolate";
import { posterContentTypes, posterMaxBytes } from "@/schemas/media/media";
import { maxAttachments } from "@/schemas/record/attachment";

type PendingAttachmentsFieldProps = {
  files: File[];
  onChange: (files: File[]) => void;
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

export function PendingAttachmentsField({
  files,
  onChange,
  dict,
}: PendingAttachmentsFieldProps) {
  const [error, setError] = useState<string>();
  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );

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
    const room = maxAttachments - files.length;
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
        {previews.map((preview, index) => (
          <li
            key={preview}
            className="relative aspect-[210/297] overflow-hidden rounded-xl bg-background"
          >
            {/* biome-ignore lint/performance/noImgElement: object URLs of local files cannot go through next/image */}
            <img src={preview} alt="" className="size-full object-cover" />
            <button
              type="button"
              onClick={() => {
                onChange(files.filter((_, i) => i !== index));
                setError(undefined);
              }}
              aria-label={interpolate(dict.attachmentRemove, {
                number: index + 1,
              })}
              className="absolute top-1.5 right-1.5 grid size-7 place-items-center rounded-full bg-foreground/70 text-background outline-none transition-colors hover:bg-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <XIcon className="size-4" aria-hidden />
            </button>
          </li>
        ))}
        {files.length < maxAttachments && (
          <li>
            <label className="flex aspect-[210/297] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed px-2 text-center text-muted-foreground text-xs outline-none transition-colors hover:text-foreground has-focus-visible:ring-2 has-focus-visible:ring-ring">
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
