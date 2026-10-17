import { Info } from "lucide-react";
import type { Metadata } from "next";
import { updateEmailAction } from "@/actions/user/update-email";
import { updatePasswordAction } from "@/actions/user/update-password";
import { updateUsernameAction } from "@/actions/user/update-username";
import { withdrawAction } from "@/actions/user/withdraw";
import { getCurrentUser } from "@/api/user/get-current-user";
import { AccountEmailForm } from "@/components/organisms/account-email-form";
import { AccountPasswordForm } from "@/components/organisms/account-password-form";
import { AccountUsernameForm } from "@/components/organisms/account-username-form";
import { PageTopBar } from "@/components/organisms/page-top-bar";
import { WithdrawSection } from "@/components/organisms/withdraw-section";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.account.title };
}

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
      <main className="flex w-full max-w-180 flex-col gap-4 px-4 pt-5 pb-8 md:px-10 md:pt-8">
        <p className="flex gap-2.5 rounded-[14px] bg-mood px-4 py-3.5 text-[13px] text-foreground leading-relaxed">
          <Info className="mt-0.5 size-4.5 shrink-0" aria-hidden />
          {dict.account.notice}
        </p>
        <AccountUsernameForm
          action={updateUsernameAction}
          user={user}
          dict={dict.account}
          counterTemplate={dict.characterCount}
        />
        <AccountEmailForm
          action={updateEmailAction}
          user={user}
          dict={dict.account}
          passwordDict={dict.passwordInput}
        />
        <AccountPasswordForm
          action={updatePasswordAction.bind(null, lang)}
          dict={dict.account}
          passwordDict={dict.passwordInput}
        />
        <WithdrawSection
          action={withdrawAction.bind(null, lang)}
          dict={dict.account}
        />
      </main>
    </>
  );
}
