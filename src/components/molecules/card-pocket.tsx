"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type MouseEvent, useState } from "react";
import { cn } from "@/lib/style/cn";

type PocketCard = { href: string; label: string };

const pullDuration = 280;

export function CardPocket({
  cards,
  label,
}: {
  cards: PocketCard[];
  label: string;
}) {
  const router = useRouter();
  const [pulled, setPulled] = useState<string | null>(null);

  const pull = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    setPulled(href);
    window.setTimeout(() => router.push(href), pullDuration);
  };

  return (
    <nav aria-label={label} className="w-full">
      <h2 className="sr-only">{label}</h2>
      <ul className="flex flex-col overflow-hidden rounded-b-md pt-8 pb-8.5">
        {cards.map((card) => (
          <li key={card.href} className="group relative h-11.5">
            <Link
              href={card.href}
              onClick={(event) => pull(event, card.href)}
              className={cn(
                "paper-theme absolute inset-x-2.5 top-0 flex h-22.5 justify-between rounded-t-[4px] bg-paper px-3.5 pt-2 font-semibold text-[13px] text-paper-ink leading-5 shadow-[0_-1px_3px_rgb(0_0_0/0.3)] outline-none transition-transform duration-280 ease-out focus-visible:ring-2 focus-visible:ring-ring group-hover:-translate-y-1 motion-reduce:transition-none",
                pulled === card.href &&
                  "-translate-y-7.5 group-hover:-translate-y-7.5",
              )}
            >
              {card.label}
              <ChevronRight
                aria-hidden
                className="mt-0.5 size-4 text-paper-label"
              />
            </Link>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-8 h-50 border-white/12 border-t bg-cover shadow-[0_-3px_4px_rgb(0_0_0/0.28)] after:absolute after:inset-x-2.5 after:top-1.5 after:border-[rgb(241_227_200/0.28)] after:border-t-[1.5px] after:border-dashed"
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
