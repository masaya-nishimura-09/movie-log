"use client";

import {
  FileText,
  Info,
  LayoutGrid,
  type LucideIcon,
  Mail,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { type AppSection, appSectionOf } from "@/lib/navigation/app-section";
import { cn } from "@/lib/style/cn";

type AppSidebarProps = {
  lang: Locale;
  dict: Dictionary["bottomNav"];
  linkDict: Pick<Dictionary["header"], "about" | "contact">;
};

const subLinkStyles =
  "flex items-center gap-3 rounded-lg px-3 py-1.5 text-muted-foreground text-sm outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring";

type NavItemProps = {
  href: string;
  label: string;
  Icon: LucideIcon;
  active: boolean;
};

function NavItem({ href, label, Icon, active }: NavItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "mx-auto flex size-11 items-center justify-center rounded-xl font-medium text-foreground-sub outline-none transition-colors hover:bg-sidebar-accent/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring lg:mx-0 lg:w-auto lg:justify-start lg:gap-3 lg:pr-4 lg:pl-3 lg:text-[15px]",
        active && "bg-sidebar-accent text-sidebar-accent-foreground",
      )}
    >
      <span className="grid size-5 shrink-0 place-items-center">
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="sr-only lg:not-sr-only">{label}</span>
    </Link>
  );
}

export function AppSidebar({ lang, dict, linkDict }: AppSidebarProps) {
  const section = appSectionOf(usePathname(), lang);
  const items: {
    key: AppSection;
    href: string;
    label: string;
    Icon: LucideIcon;
  }[] = [
    {
      key: "newRecord",
      href: `/${lang}/records/new`,
      label: dict.newRecord,
      Icon: Plus,
    },
    {
      key: "records",
      href: `/${lang}/records`,
      label: dict.records,
      Icon: LayoutGrid,
    },
    {
      key: "articles",
      href: `/${lang}/articles`,
      label: dict.articles,
      Icon: FileText,
    },
  ];

  return (
    <nav
      aria-label={dict.label}
      className="hidden w-20 shrink-0 flex-col justify-between px-2 pb-7 md:flex lg:w-60 lg:px-4"
    >
      <div className="flex flex-col gap-1">
        {items.map(({ key, ...item }) => (
          <NavItem key={key} {...item} active={section === key} />
        ))}
      </div>
      <div className="hidden flex-col lg:flex">
        <Link href={`/${lang}/about`} className={subLinkStyles}>
          <Info className="size-4" aria-hidden />
          {linkDict.about}
        </Link>
        <Link href={`/${lang}/contact`} className={subLinkStyles}>
          <Mail className="size-4" aria-hidden />
          {linkDict.contact}
        </Link>
      </div>
    </nav>
  );
}
