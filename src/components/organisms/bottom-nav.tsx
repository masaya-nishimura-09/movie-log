"use client";

import { LayoutGrid, type LucideIcon, Plus, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/style/cn";

type NavTabProps = {
  href: string;
  label: string;
  Icon: LucideIcon;
};

function NavTab({ href, label, Icon }: NavTabProps) {
  const active = usePathname() === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-1 text-[11px]",
        active ? "font-bold text-accent-foreground" : "text-muted-foreground",
      )}
    >
      <Icon className="size-5.5" aria-hidden />
      {label}
    </Link>
  );
}

type BottomNavProps = {
  lang: Locale;
  dict: Dictionary["bottomNav"];
};

export function BottomNav({ lang, dict }: BottomNavProps) {
  const pathname = usePathname();
  if (pathname.endsWith("/new") || pathname.endsWith("/edit")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 bg-sidebar pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex h-17 items-center px-2">
        <NavTab
          href={`/${lang}/records`}
          label={dict.records}
          Icon={LayoutGrid}
        />
        <Link
          href={`/${lang}/records/new`}
          className="flex h-11.5 items-center gap-1.5 rounded-full bg-primary px-5 font-bold text-primary-foreground text-sm shadow-[0_6px_14px_-8px_rgb(110_73_48/0.8)]"
        >
          <Plus className="size-4.5" aria-hidden />
          {dict.newRecord}
        </Link>
        <NavTab
          href={`/${lang}/account`}
          label={dict.account}
          Icon={UserRound}
        />
      </div>
    </nav>
  );
}
