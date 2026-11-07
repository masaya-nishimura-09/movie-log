"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, useState, useTransition } from "react";
import type { ActionResult } from "@/actions/action-result";
import { MaskingTape } from "@/components/atoms/masking-tape";
import { SectionLabel } from "@/components/atoms/section-label";
import { AttachmentViewer } from "@/components/organisms/attachment-viewer";
import type { Dictionary } from "@/i18n/get-dictionary";
import { interpolate } from "@/lib/text/interpolate";
import { posterContentTypes } from "@/schemas/media/media";
import { type Attachment, maxAttachments } from "@/schemas/record/attachment";

type RecordAttachmentSectionProps = {
  attachments: Attachment[];
  add?: (formData: FormData) => Promise<ActionResult<null>>;
  remove?: (attachmentId: string) => Promise<ActionResult<null>>;
  dict: Dictionary["recordDetail"];
  deleteDict: Dictionary["deleteAttachment"];
};

export function RecordAttachmentSection({
  attachments,
  add,
  remove,
  dict,
  deleteDict,
}: RecordAttachmentSectionProps) {
  const [openId, setOpenId] = useState<string>();
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const openIndex = attachments.findIndex((a) => a.attachmentId === openId);

  const onFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = [...(event.target.files ?? [])];
    event.target.value = "";
    if (!add || files.length === 0) return;
    const room = maxAttachments - attachments.length;
    startTransition(async () => {
      let ok = true;
      for (const file of files.slice(0, room)) {
        const formData = new FormData();
        formData.set("file", file);
        const result = await add(formData);
        if (!result.success) ok = false;
      }
      setError(
        files.length > room
          ? interpolate(dict.attachmentsLimit, { max: maxAttachments })
          : ok
            ? undefined
            : dict.attachmentsUploadError,
      );
    });
  };

  const addButton = add && attachments.length < maxAttachments && (
    <label className="flex aspect-[210/297] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[2px] border border-dashed px-2 text-center text-muted-foreground text-xs outline-none transition-colors hover:text-foreground has-disabled:cursor-default has-disabled:opacity-50 has-focus-visible:ring-2 has-focus-visible:ring-ring">
      <Plus className="size-4.5" aria-hidden />
      {pending ? dict.attachmentsUploading : dict.attachmentsAdd}
      <input
        type="file"
        accept={posterContentTypes.join(",")}
        multiple
        className="sr-only"
        disabled={pending}
        onChange={onFiles}
      />
    </label>
  );

  return (
    <section className="flex flex-col gap-2.5">
      <SectionLabel>{dict.attachments}</SectionLabel>
      {attachments.length > 0 || addButton ? (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2.5 2xl:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] 2xl:gap-3.5">
          {attachments.map((attachment, index) => (
            <li key={attachment.attachmentId} className="relative pt-2">
              <button
                type="button"
                onClick={() => setOpenId(attachment.attachmentId)}
                aria-label={interpolate(dict.attachmentOpen, {
                  number: index + 1,
                })}
                className="relative block aspect-[210/297] w-full overflow-hidden rounded-[2px] bg-card shadow-[0_6px_12px_-8px_rgb(10_41_71/0.55)] outline-none transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_18px_-10px_rgb(10_41_71/0.6)] focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Image
                  src={attachment.imageUrl}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width: 768px) 200px, 33vw"
                  className="object-cover"
                />
              </button>
              <MaskingTape className="top-0 h-3.5 w-10 in-[li:nth-child(3n)]:rotate-2 in-[li:nth-child(3n+2)]:-rotate-1" />
            </li>
          ))}
          {addButton && <li className="pt-2">{addButton}</li>}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed px-5.5 py-5 text-[15px] text-muted-foreground 2xl:px-7 2xl:py-6 2xl:text-lg">
          {dict.attachmentsEmpty}
        </p>
      )}
      {error && (
        <p role="alert" className="text-destructive-foreground text-xs">
          {error}
        </p>
      )}

      <AttachmentViewer
        attachments={attachments}
        index={openIndex}
        onIndexChange={(index) => setOpenId(attachments[index]?.attachmentId)}
        onClose={() => setOpenId(undefined)}
        remove={remove}
        dict={dict}
        deleteDict={deleteDict}
      />
    </section>
  );
}
