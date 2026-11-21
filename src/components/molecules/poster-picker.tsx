"use client";

import { LoaderCircle, Plus, X } from "lucide-react";
import Image from "next/image";
import { type DragEvent, useState, useTransition } from "react";
import type { ActionResult } from "@/actions/action-result";
import { MaskingTape } from "@/components/atoms/masking-tape";
import { cn } from "@/lib/style/cn";
import { posterContentTypes } from "@/schemas/media/media";

type PosterPickerProps = {
  name: string;
  defaultValue: string;
  upload: (formData: FormData) => Promise<ActionResult<string>>;
  invalid?: boolean;
  dict: {
    posterAdd: string;
    posterDrop: string;
    posterRemove: string;
    uploadingPoster: string;
    posterUploadError: string;
  };
};

export function PosterPicker({
  name,
  defaultValue,
  upload,
  invalid = false,
  dict,
}: PosterPickerProps) {
  const [url, setUrl] = useState(defaultValue);
  const [failed, setFailed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pending, startTransition] = useTransition();

  const send = (file: File | undefined) => {
    if (!file || pending) return;
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      const result = await upload(formData);
      setFailed(!result.success);
      if (result.success) setUrl(result.data);
    });
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    send(event.dataTransfer.files[0]);
  };

  return (
    <div className="flex flex-col">
      <input type="hidden" name={name} value={url} />
      {url ? (
        <div className="relative h-34.5 w-23 lg:h-56 lg:w-38">
          <Image
            src={url}
            alt=""
            fill
            sizes="152px"
            unoptimized={!url.startsWith("https://image.tmdb.org/")}
            className="object-cover shadow-[0_6px_14px_rgb(10_41_71/0.2)] lg:shadow-[0_10px_20px_rgb(10_41_71/0.2)]"
          />
          <MaskingTape className="-top-2 h-4 w-14 lg:-top-2.5 lg:h-5.5 lg:w-20" />
          <button
            type="button"
            aria-label={dict.posterRemove}
            data-field={name}
            onClick={() => setUrl("")}
            className="absolute -top-1.75 -right-1.75 grid size-5.5 place-items-center rounded-full bg-(--navy) text-(--beige) outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-2.75" strokeWidth={2.6} aria-hidden />
          </button>
        </div>
      ) : (
        <label
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className="relative flex h-34.5 w-23 cursor-pointer flex-col items-center justify-center gap-1 bg-white p-1.5 text-center shadow-[0_6px_14px_rgb(10_41_71/0.12)] has-focus-visible:ring-2 has-focus-visible:ring-ring lg:h-56 lg:w-38 lg:p-2"
        >
          <span
            className={cn(
              "absolute inset-1.5 border border-dashed lg:inset-2",
              invalid
                ? "border-destructive"
                : dragging
                  ? "border-primary bg-[rgb(139_94_60/0.06)]"
                  : "border-[rgb(10_41_71/0.3)]",
            )}
          />
          <span className="relative grid size-6.5 place-items-center rounded-full bg-[rgb(139_94_60/0.12)] text-primary lg:size-9">
            {pending ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
            ) : (
              <Plus className="size-3.5 lg:size-4.5" aria-hidden />
            )}
          </span>
          <span className="relative font-bold text-[11px] text-paper-label lg:text-xs">
            {pending ? dict.uploadingPoster : dict.posterAdd}
          </span>
          <span className="relative hidden text-[10px] text-paper-muted lg:block">
            {dict.posterDrop}
          </span>
          <MaskingTape className="-top-2 h-4 w-14 lg:-top-2.5 lg:h-5.5 lg:w-20" />
          <input
            type="file"
            data-field={name}
            accept={posterContentTypes.join(",")}
            className="sr-only"
            disabled={pending}
            onChange={(event) => {
              send(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
      )}
      {failed && (
        <p
          role="alert"
          className="mt-1 w-23 text-[10px] text-destructive-foreground leading-4 lg:w-38 lg:text-[11px]"
        >
          {dict.posterUploadError}
        </p>
      )}
    </div>
  );
}
