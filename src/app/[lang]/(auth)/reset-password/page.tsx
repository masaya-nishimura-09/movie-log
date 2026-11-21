import type { Metadata } from "next";
import { resetPasswordAction } from "@/actions/user/reset-password";
import { ResetPasswordForm } from "@/components/organisms/reset-password-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: dict.resetPassword.title,
    robots: { index: false },
    referrer: "no-referrer",
  };
}

export default async function ResetPasswordPage({
  searchParams,
}: PageProps<"/[lang]/reset-password">) {
  const [lang, dict, params] = await Promise.all([
    getLocale(),
    getDictionary(),
    searchParams,
  ]);
  const token = typeof params.token === "string" ? params.token : "";

  return (
    <div className="flex flex-col gap-7">
      <ResetPasswordForm
        lang={lang}
        action={resetPasswordAction.bind(null, token)}
        hasToken={token !== ""}
        dict={dict.resetPassword}
        passwordDict={dict.passwordInput}
      />
    </div>
  );
}
