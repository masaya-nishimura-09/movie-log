import { Coffee, Info, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/actions/auth/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/molecules/dropdown-menu";
import { LogoutMenuItem } from "@/components/molecules/logout-menu-item";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";

type AccountMenuProps = {
  lang: Locale;
  username: string;
  dict: Dictionary["header"];
};

export function AccountMenu({ lang, username, dict }: AccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={dict.accountMenu}
        className="grid size-9 place-items-center rounded-full bg-mood font-medium text-[13px] text-mood-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {Array.from(username)[0]}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <div className="truncate px-1.5 py-1.5 font-bold text-sm">
          {username}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={`/${lang}/account`} />}>
          <UserRound aria-hidden />
          {dict.account}
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={`/${lang}/about`} />}>
          <Info aria-hidden />
          {dict.about}
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={`/${lang}/contact`} />}>
          <Mail aria-hidden />
          {dict.contact}
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={`/${lang}/support`} />}>
          <Coffee aria-hidden />
          {dict.support}
        </DropdownMenuItem>
        <form action={logoutAction.bind(null, lang)}>
          <LogoutMenuItem label={dict.logout} pendingLabel={dict.loggingOut} />
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
