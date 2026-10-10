"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/atoms/input";
import { interpolate } from "@/lib/text/interpolate";

type CountryInputProps = {
  id: string;
  name: string;
  lang: string;
  defaultValue: string[];
  placeholder: string;
  removeTemplate: string;
};

export function CountryInput({
  id,
  name,
  lang,
  defaultValue,
  placeholder,
  removeTemplate,
}: CountryInputProps) {
  const [codes, setCodes] = useState(defaultValue);
  const regionNames = new Intl.DisplayNames(lang, { type: "region" });

  function add(raw: string) {
    const code = raw.trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(code) || codes.includes(code)) return false;
    setCodes([...codes, code]);
    return true;
  }

  return (
    <div className="flex flex-col gap-2">
      {codes.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {codes.map((code) => {
            const label = regionNames.of(code) ?? code;
            return (
              <li
                key={code}
                className="inline-flex h-8 items-center gap-1 rounded-md bg-secondary pr-1 pl-2.5 text-sm"
              >
                {label}
                <span className="text-muted-foreground text-xs">{code}</span>
                <button
                  type="button"
                  aria-label={interpolate(removeTemplate, { name: label })}
                  onClick={() => setCodes(codes.filter((c) => c !== code))}
                  className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-background hover:text-foreground"
                >
                  <X className="size-3.5" aria-hidden />
                </button>
                <input type="hidden" name={name} value={code} />
              </li>
            );
          })}
        </ul>
      )}
      <Input
        id={id}
        placeholder={placeholder}
        maxLength={2}
        autoComplete="off"
        onKeyDown={(event) => {
          if (event.key !== "Enter") return;
          event.preventDefault();
          if (add(event.currentTarget.value)) event.currentTarget.value = "";
        }}
      />
    </div>
  );
}
