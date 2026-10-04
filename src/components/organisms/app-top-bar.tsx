import { Search } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/atoms/logo";
import { SearchForm } from "@/components/molecules/search-form";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/molecules/sheet";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { AccountMenu } from "@/components/organisms/account-menu";
import { SidebarTrigger } from "@/components/organisms/sidebar";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";

type AppTopBarProps = {
  lang: Locale;
  brandName: string;
  username: string;
  dict: Dictionary["header"];
};

const roundIcon =
  "grid size-9 place-items-center rounded-full text-foreground-sub outline-none hover:bg-sidebar-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring";

export function AppTopBar({ lang, brandName, username, dict }: AppTopBarProps) {
  const search = (
    <Suspense>
      <SearchForm
        action={`/${lang}/records`}
        label={dict.searchLabel}
        placeholder={dict.searchPlaceholder}
      />
    </Suspense>
  );

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 bg-sidebar px-3 md:sticky md:top-0 md:z-30 md:gap-4 md:px-4">
      <SidebarTrigger
        label={dict.toggleSidebar}
        className="hidden size-9 rounded-full md:inline-flex"
      />
      <Link
        href={`/${lang}/records`}
        className="flex items-center rounded-sm px-1 outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-46"
      >
        <Logo name={brandName} />
      </Link>
      <div className="hidden max-w-xl flex-1 md:block">{search}</div>
      <div className="ml-auto flex items-center gap-1.5">
        <Sheet>
          <SheetTrigger
            aria-label={dict.openSearch}
            className={`${roundIcon} md:hidden`}
          >
            <Search className="size-5" aria-hidden />
          </SheetTrigger>
          <SheetContent
            side="top"
            className="shell rounded-b-[20px] bg-sidebar p-4 pt-12"
          >
            <SheetTitle className="sr-only">{dict.searchLabel}</SheetTitle>
            {search}
          </SheetContent>
        </Sheet>
        <ThemeToggle label={dict.themeToggle} className={roundIcon} />
        <AccountMenu lang={lang} username={username} dict={dict} />
      </div>
    </header>
  );
}
