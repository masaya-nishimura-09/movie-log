import { LogOut, Plus, Search, UserRound } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/atoms/button";
import { Logo } from "@/components/atoms/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/molecules/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/molecules/sheet";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { recordQueryKeys } from "@/lib/record/parse-record-query";
import { cn } from "@/lib/style/cn";

type SiteHeaderProps = {
  lang: Locale;
  brandName: string;
  username: string;
  keyword: string;
  mobileActions?: ReactNode;
  dict: Dictionary["header"];
};

function SearchForm({
  lang,
  keyword,
  dict,
  className,
}: Pick<SiteHeaderProps, "lang" | "keyword" | "dict"> & {
  className?: string;
}) {
  return (
    <form
      action={`/${lang}/records`}
      className={cn(
        "flex h-9.5 items-center gap-2 rounded-full border border-input bg-card px-3.5 focus-within:border-selected-border",
        className,
      )}
    >
      <Search className="size-4.5 shrink-0 text-placeholder" aria-hidden />
      <input
        type="search"
        name={recordQueryKeys.keyword}
        defaultValue={keyword}
        aria-label={dict.searchLabel}
        placeholder={dict.searchPlaceholder}
        className="min-w-0 flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-placeholder"
      />
    </form>
  );
}

export function SiteHeader({
  lang,
  brandName,
  username,
  keyword,
  mobileActions,
  dict,
}: SiteHeaderProps) {
  const roundIcon =
    "grid size-9 place-items-center rounded-full bg-card text-foreground-sub outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <header className="sticky top-0 z-40 border-input border-b bg-header">
      <div className="flex h-15 items-center gap-5 px-4 md:grid md:grid-cols-[1fr_auto_1fr] md:px-6">
        <Link
          href={`/${lang}/records`}
          className="justify-self-start rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Logo name={brandName} />
        </Link>

        <SearchForm
          lang={lang}
          keyword={keyword}
          dict={dict}
          className="hidden w-105 md:flex"
        />

        <div className="ml-auto flex items-center gap-2.5 md:justify-self-end">
          <div className="flex items-center gap-2.5 md:hidden">
            <Sheet>
              <SheetTrigger aria-label={dict.openSearch} className={roundIcon}>
                <Search className="size-5" aria-hidden />
              </SheetTrigger>
              <SheetContent side="top" className="bg-header p-4 pt-12">
                <SheetTitle className="sr-only">{dict.searchLabel}</SheetTitle>
                <SearchForm lang={lang} keyword={keyword} dict={dict} />
              </SheetContent>
            </Sheet>
            {mobileActions}
          </div>

          <div className="hidden items-center gap-2.5 md:flex">
            <ThemeToggle label={dict.themeToggle} className={roundIcon} />
            <Link
              href={`/${lang}/records/new`}
              className={cn(
                buttonVariants(),
                "h-10 gap-1.75 rounded-full pr-4 pl-3.5",
              )}
            >
              <Plus className="size-4.5" aria-hidden />
              {dict.newRecord}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={dict.accountMenu}
                className="grid size-8.5 place-items-center rounded-full bg-mood font-bold text-[13px] text-mood-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {Array.from(username)[0]}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem render={<Link href={`/${lang}/account`} />}>
                  <UserRound aria-hidden />
                  {dict.account}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href={`/${lang}/login`} />}>
                  <LogOut aria-hidden />
                  {dict.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
