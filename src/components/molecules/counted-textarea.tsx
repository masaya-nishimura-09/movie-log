"use client";

import { type ComponentProps, useState } from "react";
import { Textarea } from "@/components/atoms/textarea";
import { interpolate } from "@/lib/text/interpolate";

type CountedTextareaProps = Omit<
  ComponentProps<typeof Textarea>,
  "maxLength"
> & {
  maxLength: number;
  counterTemplate: string;
};

export function CountedTextarea({
  maxLength,
  counterTemplate,
  defaultValue,
  ...props
}: CountedTextareaProps) {
  const [length, setLength] = useState(String(defaultValue ?? "").length);

  return (
    <div className="flex flex-col gap-1">
      <Textarea
        maxLength={maxLength}
        defaultValue={defaultValue}
        className="min-h-32 leading-loose"
        onChange={(event) => setLength(event.target.value.length)}
        {...props}
      />
      <span className="self-end text-muted-foreground text-xs tabular-nums">
        {interpolate(counterTemplate, { current: length, max: maxLength })}
      </span>
    </div>
  );
}
