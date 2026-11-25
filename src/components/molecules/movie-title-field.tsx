"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";
import type { MovieSuggestion } from "@/schemas/movie/movie";

const searchDelay = 300;
const minQueryLength = 2;

type MovieTitleFieldProps = {
  id: string;
  name: string;
  value: string;
  onValueChange: (value: string) => void;
  search: (title: string) => Promise<MovieSuggestion[]>;
  onSelect: (movieId: string) => void;
  maxLength: number;
  listLabel: string;
  countTemplate: string;
  manualHint: string;
  placeholder: string;
  invalid?: boolean;
  required?: boolean;
};

export function MovieTitleField({
  id,
  name,
  value,
  onValueChange,
  search,
  onSelect,
  maxLength,
  listLabel,
  countTemplate,
  manualHint,
  placeholder,
  invalid = false,
  required,
}: MovieTitleFieldProps) {
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([]);
  const [active, setActive] = useState(-1);
  const [typed, setTyped] = useState(false);
  const latest = useRef(0);
  const listId = `${id}-suggestions`;
  const open = suggestions.length > 0;

  useEffect(() => {
    const query = value.trim();
    if (!typed || query.length < minQueryLength) {
      setSuggestions([]);
      return;
    }
    const request = ++latest.current;
    const timer = setTimeout(async () => {
      const result = await search(query);
      if (request !== latest.current) return;
      setSuggestions(result);
      setActive(-1);
    }, searchDelay);
    return () => clearTimeout(timer);
  }, [value, typed, search]);

  const close = () => {
    latest.current++;
    setTyped(false);
    setSuggestions([]);
  };

  const choose = (suggestion: MovieSuggestion) => {
    close();
    onSelect(suggestion.movieId);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive(
        (current) => (current + step + suggestions.length) % suggestions.length,
      );
    } else if (event.key === "Enter" && active >= 0) {
      event.preventDefault();
      const suggestion = suggestions[active];
      if (suggestion) choose(suggestion);
    } else if (event.key === "Escape") {
      close();
    }
  };

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        value={value}
        maxLength={maxLength}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-invalid={invalid || undefined}
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        className="h-12 w-full min-w-0 border-primary border-b-2 bg-transparent px-0.5 font-bold font-display text-lg text-paper-ink outline-none placeholder:text-[#a8a397] aria-invalid:border-destructive lg:h-14 lg:text-2xl"
        onChange={(event) => {
          setTyped(true);
          onValueChange(event.target.value);
        }}
        onKeyDown={onKeyDown}
        onBlur={close}
      />
      {open && (
        <div className="absolute top-full right-0 z-20 lg:right-auto lg:left-0 mt-2 w-[min(17.5rem,calc(100vw-5rem))] rounded-xl bg-[#fffdf8] p-1.5 text-paper-ink shadow-[0_14px_32px_rgb(10_41_71/0.2),0_0_0_1px_rgb(10_41_71/0.06)]">
          <p className="px-2.5 pt-1.5 pb-1 text-paper-muted text-xs">
            {listLabel} ・{" "}
            {interpolate(countTemplate, { count: suggestions.length })}
          </p>
          <div
            id={listId}
            role="listbox"
            aria-label={listLabel}
            className="max-h-64 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.movieId}
                tabIndex={-1}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === active}
                onMouseDown={(event) => {
                  event.preventDefault();
                  choose(suggestion);
                }}
                onMouseEnter={() => setActive(index)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5",
                  index === active && "bg-[rgb(139_94_60/0.12)]",
                )}
              >
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-bold font-display text-sm leading-5">
                    {suggestion.title}
                  </span>
                  <span className="truncate text-paper-muted text-xs leading-4">
                    {[
                      suggestion.releaseYear,
                      suggestion.originalTitle !== suggestion.title
                        ? suggestion.originalTitle
                        : undefined,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
                {index === active && (
                  <span className="shrink-0 text-paper-muted text-xs">
                    Enter
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-1 border-[rgb(10_41_71/0.08)] border-t px-2.5 pt-2 pb-1 text-paper-muted text-xs leading-5">
            {manualHint}
          </p>
        </div>
      )}
    </div>
  );
}
