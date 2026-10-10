"use client";

import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type MouseEvent, type ReactNode, useTransition } from "react";
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
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const shown = pending ? !active : active;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    startTransition(() => router.push(href, { scroll: false }));
  }

  return (
    <Link
      href={href}
      scroll={false}
      onClick={handleClick}
      data-active={shown}
      aria-pressed={shown}
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
