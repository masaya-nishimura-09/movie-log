import { Info } from "lucide-react";
import { updateAccountAction } from "@/actions/user/update-account";
import { withdrawAction } from "@/actions/user/withdraw";
import { getCurrentUser } from "@/api/user/get-current-user";
import { AccountForm } from "@/components/organisms/account-form";
import { PageTopBar } from "@/components/organisms/page-top-bar";
import { WithdrawSection } from "@/components/organisms/withdraw-section";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export default async function AccountPage() {
  const [lang, dict, user] = await Promise.all([
    getLocale(),
    getDictionary(),
    getCurrentUser(),
  ]);

  return (
    <>
      <PageTopBar
        backHref={`/${lang}/records`}
        backLabel={dict.account.back}
        title={dict.account.title}
      />
      <main className="mx-auto flex w-full max-w-180 flex-col gap-4 px-4 pt-4 pb-8 md:px-7 md:pt-6">
        <p className="flex gap-2.5 rounded-[14px] bg-mood px-4 py-3.5 text-[13px] text-foreground leading-relaxed">
          <Info className="mt-0.5 size-4.5 shrink-0" aria-hidden />
          {dict.account.notice}
        </p>
        <AccountForm
          action={updateAccountAction.bind(null, lang)}
          user={user}
          dict={dict.account}
          passwordDict={dict.passwordInput}
          counterTemplate={dict.characterCount}
        />
        <WithdrawSection
          action={withdrawAction.bind(null, lang)}
          dict={dict.account}
        />
      </main>
    </>
  );
}
