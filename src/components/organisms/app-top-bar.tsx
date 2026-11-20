import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { buttonVariants } from "@/components/atoms/button";
import { Logo } from "@/components/atoms/logo";
import { RecordSearchForm } from "@/components/molecules/record-search-form";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/molecules/sheet";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { AccountMenu } from "@/components/organisms/account-menu";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/style/cn";

type AppTopBarProps = {
  lang: Locale;
  brandName: string;
  username: string;
  dict: Dictionary["header"];
};

const iconButton =
  "grid size-10 place-items-center rounded-[10px] text-foreground outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring";

export function AppTopBar({ lang, brandName, username, dict }: AppTopBarProps) {
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
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-296 items-center gap-1 px-4 md:h-16 md:gap-5 md:px-8">
        <Link
          href={`/${lang}/records`}
          className="flex shrink-0 items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Logo name={brandName} className="h-8 md:h-10" />
        </Link>
        <div className="hidden min-w-50 max-w-130 flex-[0_1_520px] md:block">
          {search}
        </div>
        <div className="ml-auto flex items-center gap-1 md:gap-5">
          <Sheet>
            <SheetTrigger
              aria-label={dict.openSearch}
              className={cn(iconButton, "md:hidden")}
            >
              <Search className="size-5" aria-hidden />
            </SheetTrigger>
            <SheetContent
              side="top"
              closeLabel={dict.close}
              className="rounded-b-[20px] bg-background p-4 pt-12"
            >
              <SheetTitle className="sr-only">{dict.searchLabel}</SheetTitle>
              {search}
            </SheetContent>
          </Sheet>
          <Link
            href={`/${lang}/records/new`}
            aria-label={dict.newRecord}
            className={cn(iconButton, "md:hidden")}
          >
            <Plus className="size-5" aria-hidden />
          </Link>
          <Link
            href={`/${lang}/records/new`}
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden px-4 md:inline-flex",
            )}
          >
            <Plus aria-hidden />
            {dict.newRecord}
          </Link>
          <ThemeToggle label={dict.themeToggle} className={iconButton} />
          <AccountMenu lang={lang} username={username} dict={dict} />
        </div>
      </div>
    </header>
  );
}
