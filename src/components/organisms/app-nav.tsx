"use client";

import {
  FileText,
  House,
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

export type AppNavProps = {
  lang: Locale;
  dict: Dictionary["nav"];
  linkDict: Pick<Dictionary["header"], "about" | "contact">;
};

type Layout = "responsive" | "full";

const itemStyles = {
  responsive:
    "mx-auto size-11 justify-center lg:mx-0 lg:w-auto lg:justify-start lg:gap-3 lg:pr-4 lg:pl-3 lg:text-[15px]",
  full: "h-11 gap-3 pr-4 pl-3 text-[15px]",
};

const labelStyles = {
  responsive: "sr-only lg:not-sr-only",
  full: "",
};

const subLinksStyles = {
  responsive: "hidden lg:flex",
  full: "flex",
};

const subLinkStyles =
  "flex items-center gap-3 rounded-lg px-3 py-1.5 text-muted-foreground text-sm outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring";

type NavItemProps = {
  href: string;
  label: string;
  Icon: LucideIcon;
  active: boolean;
  layout: Layout;
  onNavigate?: () => void;
};

function NavItem({
  href,
  label,
  Icon,
  active,
  layout,
  onNavigate,
}: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center rounded-xl font-medium text-foreground-sub outline-none transition-colors hover:bg-sidebar-accent/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        itemStyles[layout],
        active && "bg-sidebar-accent text-sidebar-accent-foreground",
      )}
    >
      <span className="grid size-5 shrink-0 place-items-center">
        <Icon className="size-5" aria-hidden />
      </span>
      <span className={labelStyles[layout]}>{label}</span>
    </Link>
  );
}

export function AppNav({
  lang,
  dict,
  linkDict,
  layout,
  className,
  onNavigate,
}: AppNavProps & {
  layout: Layout;
  className?: string;
  onNavigate?: () => void;
}) {
  const section = appSectionOf(usePathname(), lang);
  const items: {
    key: AppSection;
    href: string;
    label: string;
    Icon: LucideIcon;
  }[] = [
    { key: "home", href: `/${lang}/home`, label: dict.home, Icon: House },
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
      className={cn("flex flex-col justify-between", className)}
    >
      <div className="flex flex-col gap-1">
        {items.map(({ key, ...item }) => (
          <NavItem
            key={key}
            {...item}
            active={section === key}
            layout={layout}
            onNavigate={onNavigate}
          />
        ))}
      </div>
      <div className={cn("flex-col", subLinksStyles[layout])}>
        <Link
          href={`/${lang}/about`}
          onClick={onNavigate}
          className={subLinkStyles}
        >
          <Info className="size-4" aria-hidden />
          {linkDict.about}
        </Link>
        <Link
          href={`/${lang}/contact`}
          onClick={onNavigate}
          className={subLinkStyles}
        >
          <Mail className="size-4" aria-hidden />
          {linkDict.contact}
        </Link>
      </div>
    </nav>
  );
}
