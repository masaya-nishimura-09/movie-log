import { X } from "lucide-react";
import Link from "next/link";
import { interpolate } from "@/lib/text/interpolate";

type ActiveFilterItem = { label: string; name?: string; href: string };

type ActiveFilterChipsProps = {
  label: string;
  items: ActiveFilterItem[];
  count: string;
  clearHref: string;
  removeTemplate: string;
  clearAllLabel: string;
};

export function ActiveFilterChips({
  label,
  items,
  count,
  clearHref,
  removeTemplate,
  clearAllLabel,
}: ActiveFilterChipsProps) {
  if (items.length === 0) return null;

  return (
    <div className="-mx-1 flex h-14 items-center gap-2 overflow-x-auto whitespace-nowrap px-1">
      <span className="shrink-0 text-paper-muted text-xs">{label}</span>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          scroll={false}
          aria-label={interpolate(removeTemplate, {
            label: item.name ?? item.label,
          })}
          className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full bg-(--sage) pr-2 pl-2.5 text-(--navy) text-xs outline-none hover:brightness-97 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="max-w-40 truncate">{item.label}</span>
          <X className="size-3 shrink-0" strokeWidth={2.2} aria-hidden />
        </Link>
      ))}
      <span className="ml-1 shrink-0 font-semibold text-[13px]">{count}</span>
      <Link
        href={clearHref}
        scroll={false}
        className="ml-auto shrink-0 pl-2 text-paper-label text-xs underline-offset-4 hover:underline"
      >
        {clearAllLabel}
      </Link>
    </div>
  );
}
