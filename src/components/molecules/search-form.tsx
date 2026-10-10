"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { recordQueryKeys } from "@/lib/record/parse-record-query";
import { cn } from "@/lib/style/cn";

type SearchFormProps = {
  action: string;
  label: string;
  placeholder: string;
  className?: string;
};

export function SearchForm({
  action,
  label,
  placeholder,
  className,
}: SearchFormProps) {
  const keyword = useSearchParams().get(recordQueryKeys.keyword) ?? "";

  return (
    <form
      action={action}
      className={cn(
        "flex h-10 items-center gap-2 rounded-full bg-field px-4 focus-within:ring-1 focus-within:ring-selected-border",
        className,
      )}
    >
      <Search className="size-4.5 shrink-0 text-placeholder" aria-hidden />
      <input
        key={keyword}
        type="search"
        name={recordQueryKeys.keyword}
        defaultValue={keyword}
        aria-label={label}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-placeholder"
      />
    </form>
  );
}
