import type { Metadata } from "next";
import { registerAction } from "@/actions/user/register";
import { Logo } from "@/components/atoms/logo";
import { TextLink } from "@/components/atoms/text-link";
import { RegisterForm } from "@/components/organisms/register-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { alternates } from "@/lib/seo/alternates";
import { turnstileSiteKey } from "@/lib/turnstile/verify-turnstile";

export async function generateMetadata(): Promise<Metadata> {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  return {
    title: dict.register.title,
    alternates: alternates(lang, "/register"),
  };
}

export default async function RegisterPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <Logo name={dict.brand.name} className="h-18" />
      </div>
      <RegisterForm
        lang={lang}
        siteKey={turnstileSiteKey()}
        action={registerAction.bind(null, lang)}
        dict={dict.register}
        passwordDict={dict.passwordInput}
        resendDict={dict.resendVerification}
        counterTemplate={dict.characterCount}
      />
      <TextLink
        href={`/${lang}/about`}
        tone="muted"
        className="self-center text-xs"
      >
        {dict.about.link}
      </TextLink>
    </div>
  );
}
