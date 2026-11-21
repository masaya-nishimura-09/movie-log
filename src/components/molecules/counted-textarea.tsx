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
    <div className="flex flex-col">
      <Textarea
        maxLength={maxLength}
        defaultValue={defaultValue}
        className="min-h-28"
        onChange={(event) => setLength(event.target.value.length)}
        {...props}
      />
      <span className="self-end text-muted-foreground text-xs tabular-nums leading-7">
        {interpolate(counterTemplate, { current: length, max: maxLength })}
      </span>
    </div>
  );
}
