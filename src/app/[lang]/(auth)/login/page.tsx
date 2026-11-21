import type { Metadata } from "next";
import { loginAction } from "@/actions/auth/login";
import { TextLink } from "@/components/atoms/text-link";
import { LoginForm } from "@/components/organisms/login-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { alternates } from "@/lib/seo/alternates";
import { turnstileSiteKey } from "@/lib/turnstile/verify-turnstile";

export async function generateMetadata(): Promise<Metadata> {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  return { title: dict.login.submit, alternates: alternates(lang, "/login") };
}

export default async function LoginPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <div className="flex flex-col gap-7">
      <h1 className="font-bold font-display text-lg leading-7">
        {dict.login.submit}
      </h1>
      <LoginForm
        lang={lang}
        siteKey={turnstileSiteKey()}
        action={loginAction.bind(null, lang)}
        dict={dict.login}
        passwordDict={dict.passwordInput}
        resendDict={dict.resendVerification}
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
