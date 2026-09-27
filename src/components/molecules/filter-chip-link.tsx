import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ReactNode } from "react";
import { choiceChipVariants } from "@/components/atoms/choice-chip";
import { cn } from "@/lib/style/cn";

type FilterChipLinkProps = VariantProps<typeof choiceChipVariants> & {
  href: string;
  active: boolean;
  className?: string;
  children: ReactNode;
};

export function FilterChipLink({
  href,
  active,
  shape,
  size,
  tone,
  className,
  children,
}: FilterChipLinkProps) {
  return (
    <Link
      href={href}
      scroll={false}
      data-active={active}
      aria-pressed={active}
      role="button"
      className={cn(
        choiceChipVariants({ shape, size, tone }),
        "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {children}
    </Link>
  );
}
