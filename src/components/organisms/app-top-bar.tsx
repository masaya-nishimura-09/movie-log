import { Search } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Logo, LogoMark } from "@/components/atoms/logo";
import { RecordSearchForm } from "@/components/molecules/record-search-form";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/molecules/sheet";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { AccountMenu } from "@/components/organisms/account-menu";
import { AppNavDrawer } from "@/components/organisms/app-nav-drawer";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";

type AppTopBarProps = {
  lang: Locale;
  brandName: string;
  username: string;
  dict: Dictionary["header"];
  navDict: Dictionary["nav"];
};

const roundIcon =
  "grid size-9 place-items-center rounded-full text-foreground-sub outline-none hover:bg-sidebar-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring";

export function AppTopBar({
  lang,
  brandName,
  username,
  dict,
  navDict,
}: AppTopBarProps) {
  const search = (
    <Suspense>
      <RecordSearchForm
        action={`/${lang}/records`}
        label={dict.searchLabel}
        placeholder={dict.searchPlaceholder}
      />
    </Suspense>
  );

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 bg-sidebar px-3 md:sticky md:top-0 md:z-30 md:gap-4 md:px-7">
      <AppNavDrawer
        lang={lang}
        dict={navDict}
        linkDict={dict}
        openLabel={dict.openMenu}
        closeLabel={dict.close}
        className={`${roundIcon} md:hidden`}
      />
      <Link
        href={`/${lang}/home`}
        className="flex items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-9 lg:w-49"
      >
        <span className="contents md:max-lg:hidden">
          <Logo name={brandName} />
        </span>
        <span className="hidden md:max-lg:contents">
          <LogoMark name={brandName} />
        </span>
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
            closeLabel={dict.close}
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
