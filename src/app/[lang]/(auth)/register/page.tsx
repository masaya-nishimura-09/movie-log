import type { Metadata } from "next";
import { registerAction } from "@/actions/user/register";
import { Logo } from "@/components/atoms/logo";
import { TextLink } from "@/components/atoms/text-link";
import { RegisterForm } from "@/components/organisms/register-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { turnstileSiteKey } from "@/lib/turnstile/verify-turnstile";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.register.title };
}

export default async function RegisterPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <Logo name={dict.brand.name} className="h-8" />
      </div>
      <div className="flex flex-col gap-1.5">
        <h1 className="font-bold text-foreground text-xl">
          {dict.register.title}
        </h1>
        <p className="text-muted-foreground text-xs">
          {dict.register.description}
        </p>
      </div>
      <RegisterForm
        lang={lang}
        siteKey={turnstileSiteKey()}
        action={registerAction.bind(null, lang)}
        dict={dict.register}
        passwordDict={dict.passwordInput}
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
