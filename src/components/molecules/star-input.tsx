"use client";

import { useState } from "react";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";

type StarInputProps = {
  name: string;
  label: string;
  starLabel: string;
  defaultValue?: number;
  invalid?: boolean;
};

const starPath =
  "m12 3.5 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z";

export function StarInput({
  name,
  label,
  starLabel,
  defaultValue,
  invalid = false,
}: StarInputProps) {
  const [value, setValue] = useState(defaultValue ?? 0);
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-invalid={invalid || undefined}
      className="flex text-primary"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((score) => (
        <label
          key={score}
          className="grid size-7 cursor-pointer place-items-center rounded-md has-focus-visible:ring-2 has-focus-visible:ring-ring"
          onMouseEnter={() => setHover(score)}
        >
          <input
            type="radio"
            name={name}
            value={score}
            required
            checked={value === score}
            onChange={() => setValue(score)}
            aria-label={interpolate(starLabel, { score })}
            className="sr-only"
          />
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={cn(
              "size-4.5",
              invalid && value === 0 && "text-destructive",
            )}
            fill={score <= shown ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinejoin="round"
          >
            <path d={starPath} />
          </svg>
        </label>
      ))}
    </div>
  );
}
