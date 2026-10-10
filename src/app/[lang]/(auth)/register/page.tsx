import type { Metadata } from "next";
import Link from "next/link";
import { registerAction } from "@/actions/user/register";
import { Logo } from "@/components/atoms/logo";
import { RegisterForm } from "@/components/organisms/register-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.register.title };
}

export default async function RegisterPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <Logo name={dict.brand.name} className="text-2xl [&>svg]:size-7" />
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
        action={registerAction.bind(null, lang)}
        dict={dict.register}
        passwordDict={dict.passwordInput}
        counterTemplate={dict.characterCount}
      />
      <Link
        href={`/${lang}/about`}
        className="self-center rounded-sm font-medium text-foreground-sub text-xs outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
      >
        {dict.about.link}
      </Link>
    </div>
  );
}
