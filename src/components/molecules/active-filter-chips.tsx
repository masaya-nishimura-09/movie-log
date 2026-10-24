import { X } from "lucide-react";
import Link from "next/link";
import { interpolate } from "@/lib/text/interpolate";

type ActiveFilterItem = { label: string; href: string };

type ActiveFilterChipsProps = {
  items: ActiveFilterItem[];
  clearHref: string;
  removeTemplate: string;
  clearAllLabel: string;
};

export function ActiveFilterChips({
  items,
  clearHref,
  removeTemplate,
  clearAllLabel,
}: ActiveFilterChipsProps) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          scroll={false}
          aria-label={interpolate(removeTemplate, { label: item.label })}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-selected px-2.75 font-medium text-selected-foreground text-xs hover:brightness-97"
        >
          <span className="max-w-48 truncate">{item.label}</span>
          <X className="size-3.75 shrink-0" aria-hidden />
        </Link>
      ))}
      <Link
        href={clearHref}
        scroll={false}
        className="px-1.5 font-medium text-muted-foreground text-xs underline-offset-4 hover:underline"
      >
        {clearAllLabel}
      </Link>
    </div>
  );
}
