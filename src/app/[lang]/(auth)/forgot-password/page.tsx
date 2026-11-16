import type { Metadata } from "next";
import { requestPasswordResetAction } from "@/actions/user/request-password-reset";
import { Logo } from "@/components/atoms/logo";
import { ForgotPasswordForm } from "@/components/organisms/forgot-password-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.forgotPassword.title, robots: { index: false } };
}

export default async function ForgotPasswordPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <Logo name={dict.brand.name} className="h-18" />
      </div>
      <ForgotPasswordForm
        lang={lang}
        action={requestPasswordResetAction.bind(null, lang)}
        dict={dict.forgotPassword}
        resendDict={dict.resendPasswordReset}
      />
    </div>
  );
}
