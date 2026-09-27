import { LoginForm } from "@/components/organisms/login-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

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
        dict={dict.login}
        passwordDict={dict.passwordInput}
      />
    </div>
  );
}
