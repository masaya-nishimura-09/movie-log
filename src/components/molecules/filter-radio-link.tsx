import Link from "next/link";
import { cn } from "@/lib/style/cn";

type FilterRadioLinkProps = {
  href: string;
  active: boolean;
  label: string;
};

export function FilterRadioLink({ href, active, label }: FilterRadioLinkProps) {
  return (
    <Link
      href={href}
      scroll={false}
      role="radio"
      aria-checked={active}
      className="flex items-center gap-2.25 rounded-sm font-medium text-[13px] text-foreground outline-none hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        className={cn(
          "grid size-4.25 shrink-0 place-items-center rounded-full",
          active ? "bg-selected-border" : "bg-field",
        )}
      >
        {active && (
          <span className="size-1.75 rounded-full bg-primary-foreground" />
        )}
      </span>
      <span className="flex-1 truncate">{label}</span>
    </Link>
  );
}
