import { Search } from "lucide-react";
import { cn } from "@/lib/style/cn";

type SearchFormProps = {
  action: string;
  name: string;
  keyword: string;
  hidden?: Record<string, string | undefined>;
  label: string;
  placeholder: string;
  maxLength?: number;
  className?: string;
};

export function SearchForm({
  action,
  name,
  keyword,
  hidden = {},
  label,
  placeholder,
  maxLength,
  className,
}: SearchFormProps) {
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
        name={name}
        defaultValue={keyword}
        aria-label={label}
        placeholder={placeholder}
        maxLength={maxLength}
        className="min-w-0 flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-placeholder"
      />
      {Object.entries(hidden).map(([key, value]) =>
        value === undefined || value === "" ? null : (
          <input key={key} type="hidden" name={key} value={value} />
        ),
      )}
    </form>
  );
}
