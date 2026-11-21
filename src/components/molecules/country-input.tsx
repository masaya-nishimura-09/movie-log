"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { notebookLine } from "@/components/atoms/notebook-input";
import { pickerChip } from "@/components/molecules/choice-picker";
import { countryCode } from "@/lib/record/country-code";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";

type CountryInputProps = {
  id: string;
  name: string;
  lang: string;
  defaultValue: string[];
  placeholder: string;
  addLabel: string;
  notFoundLabel: string;
  removeTemplate: string;
  invalid?: boolean;
};

export function CountryInput({
  id,
  name,
  lang,
  defaultValue,
  placeholder,
  addLabel,
  notFoundLabel,
  removeTemplate,
  invalid = false,
}: CountryInputProps) {
  const [codes, setCodes] = useState(defaultValue);
  const [notFound, setNotFound] = useState(false);
  const regionNames = new Intl.DisplayNames(lang, { type: "region" });

  function add(raw: string) {
    if (raw.trim() === "") return false;
    const code = countryCode(raw, lang);
    setNotFound(!code);
    if (!code) return false;
    if (!codes.includes(code)) setCodes([...codes, code]);
    return true;
  }

  return (
    <div>
      <div
        className={cn(
          "flex min-h-7 flex-wrap items-center gap-1 px-0.5 py-0.5 focus-within:border-primary lg:gap-1.5",
          notebookLine,
        )}
        aria-invalid={invalid || undefined}
      >
        {codes.map((code) => {
          const label = regionNames.of(code) ?? code;
          return (
            <span key={code} className={cn(pickerChip, "gap-1 pr-1.5")}>
              {label}
              <button
                type="button"
                aria-label={interpolate(removeTemplate, { name: label })}
                onClick={() => setCodes(codes.filter((c) => c !== code))}
                className="grid size-4 place-items-center rounded-full outline-none hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-2.5" strokeWidth={2.6} aria-hidden />
              </button>
              <input type="hidden" name={name} value={code} />
            </span>
          );
        })}
        <input
          id={id}
          data-field={name}
          aria-label={addLabel}
          aria-invalid={notFound || undefined}
          onChange={() => setNotFound(false)}
          placeholder={codes.length > 0 ? `+ ${addLabel}` : placeholder}
          autoComplete="off"
          className="h-6 min-w-24 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#a8a397] lg:text-sm"
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            if (add(event.currentTarget.value)) event.currentTarget.value = "";
          }}
          onBlur={(event) => {
            if (add(event.currentTarget.value)) event.currentTarget.value = "";
          }}
        />
      </div>
      {notFound && (
        <p
          role="alert"
          className="text-destructive-foreground text-xs leading-7"
        >
          {notFoundLabel}
        </p>
      )}
    </div>
  );
}
