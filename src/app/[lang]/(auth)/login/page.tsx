import type { Metadata } from "next";
import Link from "next/link";
import { loginAction } from "@/actions/auth/login";
import { LoginForm } from "@/components/organisms/login-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.login.submit };
}

export default async function LoginPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-bold text-2xl text-foreground">
          {dict.brand.name}
        </h1>
        <p className="text-[13px] text-foreground-sub">{dict.brand.tagline}</p>
      </div>
      <LoginForm
        lang={lang}
        action={loginAction.bind(null, lang)}
        dict={dict.login}
        passwordDict={dict.passwordInput}
      />
      <Link
        href={`/${lang}/about`}
        className="self-center rounded-sm text-foreground-sub text-xs outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
      >
        {dict.about.link}
      </Link>
    </div>
  );
}
