"use client";

import { type ComponentProps, useState } from "react";
import { Input } from "@/components/atoms/input";
import { interpolate } from "@/lib/text/interpolate";

type CountedInputProps = Omit<ComponentProps<typeof Input>, "maxLength"> & {
  maxLength: number;
  counterTemplate: string;
};

export function CountedInput({
  maxLength,
  counterTemplate,
  defaultValue,
  onChange,
  ...props
}: CountedInputProps) {
  const [length, setLength] = useState(String(defaultValue ?? "").length);

  return (
    <div className="relative">
      <Input
        maxLength={maxLength}
        defaultValue={defaultValue}
        className="pr-20"
        onChange={(event) => {
          setLength(event.target.value.length);
          onChange?.(event);
        }}
        {...props}
      />
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground text-xs tabular-nums">
        {interpolate(counterTemplate, { current: length, max: maxLength })}
      </span>
    </div>
  );
}
