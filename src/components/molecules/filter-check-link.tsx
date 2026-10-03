import { Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/style/cn";

type FilterCheckLinkProps = {
  href: string;
  active: boolean;
  label: string;
};

export function FilterCheckLink({ href, active, label }: FilterCheckLinkProps) {
  return (
    <Link
      href={href}
      scroll={false}
      role="checkbox"
      aria-checked={active}
      className="flex items-center gap-2.25 rounded-sm text-[13px] text-foreground outline-none hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        className={cn(
          "grid size-4.25 shrink-0 place-items-center rounded-[5px] border-[1.5px]",
          active
            ? "border-selected-border bg-selected-border text-white"
            : "border-dash-line bg-card",
        )}
      >
        {active && <Check className="size-3" strokeWidth={3} aria-hidden />}
      </span>
      <span className="flex-1 truncate">{label}</span>
    </Link>
  );
}
