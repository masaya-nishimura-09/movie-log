"use client";

import { Upload } from "lucide-react";
import { type ChangeEvent, useState, useTransition } from "react";
import type { ActionResult } from "@/actions/action-result";
import { buttonVariants } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { cn } from "@/lib/style/cn";
import { posterContentTypes } from "@/schemas/media/media";

type PosterUrlFieldProps = {
  id: string;
  name: string;
  defaultValue: string;
  placeholder: string;
  upload: (formData: FormData) => Promise<ActionResult<string>>;
  uploadLabel: string;
  uploadingLabel: string;
  errorLabel: string;
};

export function PosterUrlField({
  id,
  name,
  defaultValue,
  placeholder,
  upload,
  uploadLabel,
  uploadingLabel,
  errorLabel,
}: PosterUrlFieldProps) {
  const [url, setUrl] = useState(defaultValue);
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      const result = await upload(formData);
      setFailed(!result.success);
      if (result.success) setUrl(result.data);
    });
  };

  return (
    <div className="@container flex flex-col gap-2">
      <div className="flex flex-wrap @md:flex-nowrap gap-2">
        <Input
          id={id}
          name={name}
          type="url"
          placeholder={placeholder}
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          className="@md:flex-1 @md:basis-0 basis-full"
        />
        <label
          className={cn(
            buttonVariants({ variant: "outline" }),
            "@md:w-auto w-full cursor-pointer has-disabled:cursor-default has-disabled:opacity-50",
          )}
        >
          <Upload className="size-4" aria-hidden />
          {pending ? uploadingLabel : uploadLabel}
          <input
            type="file"
            accept={posterContentTypes.join(",")}
            className="sr-only"
            disabled={pending}
            onChange={onFile}
          />
        </label>
      </div>
      {failed && (
        <p role="alert" className="text-destructive-foreground text-xs">
          {errorLabel}
        </p>
      )}
    </div>
  );
}
