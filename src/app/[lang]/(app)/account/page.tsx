import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { changeLocaleAction } from "@/actions/locale/change-locale";
import { exportNotesAction } from "@/actions/record/export-notes";
import { exportRecordsAction } from "@/actions/record/export-records";
import { updateEmailAction } from "@/actions/user/update-email";
import { updatePasswordAction } from "@/actions/user/update-password";
import { updateUsernameAction } from "@/actions/user/update-username";
import { withdrawAction } from "@/actions/user/withdraw";
import { getCurrentUser } from "@/api/user/get-current-user";
import { phrases } from "@/components/atoms/phrases";
import { AccountEmailForm } from "@/components/organisms/account-email-form";
import { AccountPasswordForm } from "@/components/organisms/account-password-form";
import { AccountUsernameForm } from "@/components/organisms/account-username-form";
import { ExportSection } from "@/components/organisms/export-section";
import { LanguageSection } from "@/components/organisms/language-section";
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
    <div className="app-container pb-14">
      <div className="pt-3 pb-2 md:pt-4">
        <Link
          href={`/${lang}/records`}
          className="-ml-1 inline-flex min-h-11 items-center gap-2 rounded-sm px-1 text-foreground text-sm outline-none hover:text-link focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="size-4.5" aria-hidden />
          {dict.common.toContents}
        </Link>
      </div>
      <h1 className="font-bold font-display text-2xl leading-10 md:text-[28px]">
        {dict.account.title}
      </h1>
      <p className="mt-1.5 mb-7 text-[13px] text-muted-foreground">
        {phrases(dict.account.notice)}
      </p>
      <AccountUsernameForm
        action={updateUsernameAction}
        user={user}
        dict={dict.account}
        counterTemplate={dict.characterCount}
      />
      <AccountEmailForm
        action={updateEmailAction.bind(null, lang)}
        user={user}
        dict={dict.account}
        passwordDict={dict.passwordInput}
      />
      <AccountPasswordForm
        action={updatePasswordAction.bind(null, lang)}
        dict={dict.account}
        passwordDict={dict.passwordInput}
      />
      <LanguageSection
        lang={lang}
        action={changeLocaleAction}
        dict={dict.account}
      />
      <ExportSection
        lang={lang}
        exportRecords={exportRecordsAction}
        exportNotes={exportNotesAction}
        dict={dict.account}
        csvDict={{ recordForm: dict.recordForm, enums: dict.enums }}
        releaseYearTemplate={dict.recordDetail.releaseYear}
      />
      <WithdrawSection
        action={withdrawAction.bind(null, lang)}
        dict={dict.account}
      />
    </div>
  );
}
