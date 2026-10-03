"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { Input } from "@/components/atoms/input";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";
import type { MovieSuggestion, MovieValues } from "@/schemas/movie/movie";
import type { RecordFormValues } from "@/schemas/record/record-form";

const searchDelay = 300;
const minQueryLength = 2;

export function useMovieAssist(
  initial: RecordFormValues,
  getMovie: (movieId: string) => Promise<MovieValues | undefined>,
) {
  const [title, setTitle] = useState(initial.title);
  const [values, setValues] = useState(initial);
  const [version, setVersion] = useState(0);

  const select = async (movieId: string) => {
    const movie = await getMovie(movieId);
    if (!movie) return;
    setTitle(movie.title);
    setValues((current) => ({ ...current, ...movie }));
    setVersion((current) => current + 1);
  };

  return { title, setTitle, values, version, select };
}

type MovieTitleFieldProps = {
  id: string;
  name: string;
  value: string;
  onValueChange: (value: string) => void;
  search: (title: string) => Promise<MovieSuggestion[]>;
  onSelect: (movieId: string) => void;
  maxLength: number;
  counterTemplate: string;
  listLabel: string;
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
  counterTemplate,
  listLabel,
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
      <Input
        id={id}
        name={name}
        value={value}
        maxLength={maxLength}
        required={required}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        className="pr-20"
        onChange={(event) => {
          setTyped(true);
          onValueChange(event.target.value);
        }}
        onKeyDown={onKeyDown}
        onBlur={close}
      />
      <span className="pointer-events-none absolute inset-y-0 right-3 flex h-11 items-center text-muted-foreground text-xs tabular-nums">
        {interpolate(counterTemplate, {
          current: value.length,
          max: maxLength,
        })}
      </span>
      {open && (
        <div
          id={listId}
          role="listbox"
          aria-label={listLabel}
          className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded-lg border bg-card p-1 shadow-lg"
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
                "flex cursor-pointer flex-col gap-0.5 rounded-md px-3 py-2 text-sm",
                index === active && "bg-accent text-accent-foreground",
              )}
            >
              <span className="text-foreground">
                {suggestion.title}
                {suggestion.releaseYear && (
                  <span className="ml-2 text-muted-foreground text-xs tabular-nums">
                    {suggestion.releaseYear}
                  </span>
                )}
              </span>
              {suggestion.originalTitle !== suggestion.title && (
                <span className="text-muted-foreground text-xs">
                  {suggestion.originalTitle}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
