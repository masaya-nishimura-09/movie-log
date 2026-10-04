import { Info, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/actions/auth/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/molecules/dropdown-menu";
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
        className="grid size-9 place-items-center rounded-full bg-mood font-bold text-[13px] text-mood-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {Array.from(username)[0]}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <div className="truncate px-1.5 py-1.5 font-medium text-sm">
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
        <form action={logoutAction.bind(null, lang)}>
          <DropdownMenuItem
            nativeButton
            closeOnClick={false}
            render={<button type="submit" className="w-full" />}
          >
            <LogOut aria-hidden />
            {dict.logout}
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
